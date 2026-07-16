export const API_URL = "http://localhost:5000/api";

export function getAuthToken() {
  return sessionStorage.getItem("token");
}

export function setAuthToken(token) {
  sessionStorage.setItem("token", token);
}

export function removeAuthToken() {
  sessionStorage.removeItem("token");
}

export async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
}
