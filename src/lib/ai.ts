import type { AIPromptResponse, AIErrorCode } from '@/types/board';

class AIError extends Error {
  constructor(
    message: string,
    public code: AIErrorCode,
  ) {
    super(message);
    this.name = 'AIError';
  }
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are PromptViz, an AI that generates visual concept boards from text prompts.
Given a user's creative prompt, respond ONLY with valid JSON (no markdown, no explanation) matching this schema:
{
  "heading": "string (2-5 word evocative title for the concept)",
  "colorPalette": [
    { "hex": "#rrggbb", "name": "color name" },
    { "hex": "#rrggbb", "name": "color name" },
    { "hex": "#rrggbb", "name": "color name" }
  ],
  "imageQueries": [
    "string (1-3 word Unsplash search query for main image)",
    "string (1-3 word Unsplash search query for supporting image 1)",
    "string (1-3 word Unsplash search query for supporting image 2)"
  ]
}
Respond with only the JSON object.`;

/**
 * Call Groq LLM to parse a user prompt into structured board data.
 * Falls back to a default board on error so the UI never breaks.
 */
export async function parsePrompt(prompt: string): Promise<AIPromptResponse> {
  // If no API key is configured, return a graceful default
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    return getDefaultBoard(prompt);
  }

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 512,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.warn('[AI] Groq API error', res.status, body);
      if (res.status === 429) {
        throw new AIError('API quota exceeded. Please try again shortly.', 'QUOTA_EXCEEDED');
      }
      throw new AIError(`API error: ${res.status}`, 'API_ERROR');
    }

    const json = await res.json();
    const text: string = json?.choices?.[0]?.message?.content ?? '';
    const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    let parsed: AIPromptResponse;
    try {
      parsed = JSON.parse(trimmed) as AIPromptResponse;
    } catch {
      throw new AIError('Invalid response from AI. Please try again.', 'INVALID_RESPONSE');
    }

    validateResponse(parsed);
    return parsed;
  } catch (err) {
    if (err instanceof AIError) throw err;
    console.warn('[AI] Network error, using default board', err);
    throw new AIError('Could not reach AI service. Using demo board.', 'NETWORK_ERROR');
  }
}

function validateResponse(data: AIPromptResponse): void {
  if (
    !data ||
    typeof data.heading !== 'string' ||
    !Array.isArray(data.colorPalette) ||
    !Array.isArray(data.imageQueries) ||
    data.colorPalette.length !== 3 ||
    data.imageQueries.length !== 3
  ) {
    throw new AIError('AI response missing required fields.', 'INVALID_RESPONSE');
  }
}

function getDefaultBoard(prompt: string): AIPromptResponse {
  return {
    heading: prompt.slice(0, 40) || 'Your Vision',
    colorPalette: [
      { hex: '#2D3142', name: 'Deep Slate' },
      { hex: '#4F5D75', name: 'Steel Blue' },
      { hex: '#BFC0C0', name: 'Silver Mist' },
    ],
    imageQueries: ['nature landscape', 'abstract color', 'minimal design'],
  };
}
