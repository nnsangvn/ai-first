export interface ColorSwatch {
  hex: string;
  name: string;
}

export interface ImageRef {
  query: string;
  url: string;
  alt: string;
}

export interface ConceptBoard {
  id: string;
  prompt: string;
  heading: string;
  colorPalette: ColorSwatch[];
  images: ImageRef[];
  createdAt: string; // ISO string
}

export interface SavedBoard extends ConceptBoard {
  savedAt: string; // ISO string
}

// AI API response shape (parsed from LLM JSON)
export interface AIPromptResponse {
  heading: string;
  colorPalette: Array<{ hex: string; name: string }>;
  imageQueries: string[];
}

// AI service error
export type AIErrorCode =
  | 'NETWORK_ERROR'
  | 'INVALID_RESPONSE'
  | 'API_ERROR'
  | 'QUOTA_EXCEEDED';

export class AIError extends Error {
  constructor(
    message: string,
    public code: AIErrorCode,
  ) {
    super(message);
    this.name = 'AIError';
  }
}
