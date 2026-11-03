import { cookies } from "next/headers";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function serverFetch(path, options = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const headers = new Headers(options.headers);
  if (cookieHeader) headers.set("cookie", cookieHeader);

  return fetch(`${SERVER_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });
}

export async function getCurrentUser() {
  try {
    const res = await serverFetch("/api/auth/me");
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}
