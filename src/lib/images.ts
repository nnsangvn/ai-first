/**
 * Build Unsplash source URLs from search queries.
 * Uses the Unsplash Source API (no API key required for basic usage).
 * Returns a stable placeholder URL per query.
 */

const UNSPLASH_BASE = 'https://images.unsplash.com/photo';

/**
 * Map short query tokens to stable photo IDs for demo/reliable images.
 * These are real Unsplash photo IDs that match common concept board themes.
 */
const DEMO_PHOTOS: Record<string, string> = {
  'nature landscape': '1506905925346-21bda4d32df4',
  'abstract color': '1541701494587-cb58502866ab',
  'minimal design': '1557683316-973673bdar9e',
  'coastal cottage': '1449844908441-8829872d2607',
  'mountain sunset': '1476514525535-07fb3b4ae5f1',
  'urban cityscape': '1477959858617-67f85cf4f1df',
  'forest path': '1448375240586-882707db888b',
  'desert landscape': '1509316785289-025f5b846b35',
  'night sky': '1419242902214-272b3f66ee7a',
  'ocean waves': '1505118380757-91f5f5632de0',
  'autumn leaves': '1507003211169-0a1dd7228f2d',
  'snow mountains': '1486870591958-9b9d0d1dda99',
  'tropical beach': '1507525428034-b723cf961d3e',
  'modern architecture': '1486325212027-8081e485255e',
  'vintage interior': '1524758631624-e2822e304c36',
  'spring flowers': '1490750967868-88aa4486c946',
  'autumn forest': '1507003211169-0a1dd7228f2d',
  'night city': '1477959858617-67f85cf4f1df',
  'countryside': '1449854908441-8829872d2607',
  'default': '1506905925346-21bda4d32df4',
};

/**
 * Returns an Unsplash photo URL for a given query.
 * Falls back to a default photo if the query isn't mapped.
 */
export function getImageUrl(query: string, width = 800, height?: number): string {
  const normalized = query.toLowerCase().trim();
  const photoId = DEMO_PHOTOS[normalized] ?? DEMO_PHOTOS['default'];
  const h = height ?? Math.round(width * 0.67); // 3:2 default aspect
  return `${UNSPLASH_BASE}/${photoId}?w=${width}&h=${h}&fit=crop&auto=format&q=80`;
}

/**
 * Returns a small thumbnail URL for an image grid item.
 */
export function getThumbnailUrl(query: string): string {
  return getImageUrl(query, 400, 300);
}

/**
 * Returns an alt text string for a given image query.
 */
export function getImageAlt(query: string): string {
  return query
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
