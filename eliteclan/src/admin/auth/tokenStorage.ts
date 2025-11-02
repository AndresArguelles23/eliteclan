import { restoreSession, type AuthTokens } from '../../services/api';

const STORAGE_KEY = 'eliteclan-admin-session';
const SECRET = import.meta.env.VITE_ADMIN_TOKEN_SECRET ?? import.meta.env.VITE_TOKEN_SECRET ?? 'eliteclan-admin';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function deriveKey() {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return null;
  }

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('eliteclan-admin-salt'),
      iterations: 250_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encrypt(data: string) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey();
  if (!key) return null;
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoder.encode(data),
  );
  return `${Array.from(iv).join(',')}|${Array.from(new Uint8Array(encrypted)).join(',')}`;
}

async function decrypt(payload: string) {
  const [ivRaw, dataRaw] = payload.split('|');
  if (!ivRaw || !dataRaw) return null;
  const iv = new Uint8Array(ivRaw.split(',').map((v) => Number.parseInt(v, 10)));
  const buffer = new Uint8Array(dataRaw.split(',').map((v) => Number.parseInt(v, 10)));
  const key = await deriveKey();
  if (!key) return null;
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    buffer,
  );
  return decoder.decode(decrypted);
}

export async function saveTokens(tokens: AuthTokens) {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify(tokens);
    const encrypted = (await encrypt(payload)) ?? payload;
    window.sessionStorage.setItem(STORAGE_KEY, encrypted);
  } catch (error) {
    console.error('[tokenStorage] Failed to encrypt session, falling back to plain text', error);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  }
}

export async function loadTokens(): Promise<AuthTokens | null> {
  if (typeof window === 'undefined') return null;
  const value = window.sessionStorage.getItem(STORAGE_KEY);
  if (!value) return null;
  try {
    const decrypted = (await decrypt(value)) ?? value;
    const parsed = JSON.parse(decrypted) as AuthTokens;
    if (!parsed?.accessToken || !parsed?.refreshToken) return null;
    return parsed;
  } catch (error) {
    console.warn('[tokenStorage] Failed to load tokens', error);
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export async function clearTokens() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export async function restorePersistedSession() {
  const tokens = await loadTokens();
  if (!tokens) return null;
  try {
    const session = await restoreSession(tokens);
    if (!session) {
      await clearTokens();
      return null;
    }
    return session;
  } catch (error) {
    console.error('[tokenStorage] Unable to restore session', error);
    await clearTokens();
    return null;
  }
}
