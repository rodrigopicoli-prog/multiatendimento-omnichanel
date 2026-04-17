import { useAuthStore } from '@/store/auth-store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

type RequestConfig = RequestInit & { auth?: boolean };

async function refreshAccessToken() {
  const { refreshToken, clearSession, setSession, user, accessToken } = useAuthStore.getState();
  if (!refreshToken || !user || !accessToken) return null;

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    return null;
  }

  const data = await response.json();
  setSession({ accessToken: data.accessToken, refreshToken, user });
  return data.accessToken as string;
}

export async function http<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const auth = config.auth ?? true;
  const token = useAuthStore.getState().accessToken;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...(config.headers ?? {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return http<T>(path, {
        ...config,
        headers: {
          ...(config.headers ?? {}),
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Erro na requisição');
  }

  return response.json() as Promise<T>;
}
