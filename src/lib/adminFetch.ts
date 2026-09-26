export async function adminFetch(token: string, input: string, init: RequestInit = {}) {
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
