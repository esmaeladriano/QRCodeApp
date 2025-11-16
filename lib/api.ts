import { Platform } from 'react-native';

// Detect best base URL depending on platform
// - Web: localhost works
// - Android emulator: 10.0.2.2 maps to host loopback
// - iOS simulator: localhost works
const HOST = Platform.select({
  android: 'http://10.0.2.2:4000',
  default: 'http://localhost:4000',
});

export const API_BASE_URL = HOST!;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(API_BASE_URL + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const text = await res.text();
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (e) {
    // non-JSON response
    throw new Error(`Request failed (${res.status})`);
  }
  if (!res.ok) {
    const msg = json?.error || `Request failed (${res.status})`;
    const err = new Error(msg) as Error & { status?: number; body?: any };
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json as T;
}

export const api = {
  register(params: { name: string; email: string; password: string; phone?: string }) {
    return request<{ user: any; token: string }>(`/auth/register`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
  sendVerification(email: string) {
    return request<{ ok: true }>(`/auth/send-verification`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  login(params: { email: string; password: string }) {
    return request<{ user: any; token: string }>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
  me(token: string) {
    return request<{ user: any }>(`/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
