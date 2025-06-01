const API_BASE = "http://192.168.43.111:5000/api/auth";
const TOKEN_KEY = "auth_token";

// Save token
function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Get token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Remove token
export async function logout(): Promise<void> {
  localStorage.removeItem(TOKEN_KEY);
}

// Register user via backend
export async function register(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return { ok: false, error: data.error || "Signup failed" };

    saveToken(data.token);
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error during signup" };
  }
}

// Login user via backend
export async function authenticate(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return { ok: false, error: data.error || "Login failed" };

    saveToken(data.token);
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error during login" };
  }
}

// Extract user from JWT (optional helper)
export async function getUserEmail(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload?.id ?? null; // or payload.email if email is in token
  } catch {
    return null;
  }
}
