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
  events: {
    create(params: {
      name: string;
      category?: string;
      location?: string;
      date: string; // YYYY-MM-DD
      startTime: string; // HH:mm
      endTime: string; // HH:mm
      capacity: number;
      description?: string;
      bannerUrl?: string;
    }, token?: string) {
      return request<{ id: string }>(`/events`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify(params),
      });
    },
    get(id: string, token?: string) {
      return request<{ id: string; name: string; category?: string; location?: string; date: string; startTime: string; endTime: string; capacity: number; description?: string; bannerUrl?: string }>(`/events/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    },
    cancel(id: string, token?: string) {
      return request<{ ok: true }>(`/events/${id}/cancel`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    },
  },
  upload: {
    banner(fileUri: string, token?: string, onProgress?: (progress: number) => void) {
      const form = new FormData();
      const name = fileUri.split('/').pop() || 'banner.jpg';
      form.append('file', { uri: fileUri, name, type: 'image/jpeg' } as any);
      return new Promise<{ url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', API_BASE_URL + '/upload');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.onload = () => {
          try {
            const json = xhr.responseText ? JSON.parse(xhr.responseText) : {};
            if (xhr.status >= 200 && xhr.status < 300) resolve(json as { url: string });
            else reject(new Error(json?.error || `Upload failed (${xhr.status})`));
          } catch (e) {
            reject(new Error(`Upload failed (${xhr.status})`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        if (xhr.upload && onProgress) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
          };
        }
        xhr.send(form);
      });
    },
  },
};
