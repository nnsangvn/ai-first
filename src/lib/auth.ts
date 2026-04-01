/**
 * Bypass authentication — simulates a successful login without any backend call.
 * Replace this module with real auth (e.g. Supabase, Clerk, Cognito) when ready.
 */

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

/** 300ms artificial delay to make the UX feel realistic. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Accepts any email + any password and returns a mock authenticated user.
 * Throws on empty inputs.
 */
export async function bypassLogin(email: string, password: string): Promise<AuthResult> {
  if (!email.trim()) throw new Error('Email is required.');
  if (!password.trim()) throw new Error('Password is required.');

  await delay(300);

  // Derive a display name from the email for a natural feel.
  const localPart = email.split('@')[0] ?? email;
  const displayName = localPart
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  return {
    user: {
      id: `mock-${Date.now()}`,
      email: email.trim().toLowerCase(),
      displayName: displayName || 'User',
    },
    token: `mock-token-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };
}
