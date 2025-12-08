// src/lib/adminClient.ts

export function getAdminKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jjj_admin_key");
}

export async function adminFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const key = getAdminKey();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  if (key) headers["x-admin-key"] = key;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }

  return (await res.json()) as T;
}

// Re-export types for convenience
export type { AdminStats } from "@/app/api/admin/stats/route";
export type { AdminUser } from "@/app/api/admin/users/route";

