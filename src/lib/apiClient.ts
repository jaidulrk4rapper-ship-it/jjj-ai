// src/lib/apiClient.ts
// Centralized API client with userId header

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  userId?: string | null
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  // Add userId header if provided
  if (userId) {
    headers["x-user-id"] = userId;
  } else {
    // Try to get from localStorage
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("jjj_user_id");
      if (storedUserId) {
        headers["x-user-id"] = storedUserId;
      }
    }
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // Always include cookies
  });
}

