const API_BASE = "https://expenza.loca.lt/api/auth"
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

export async function register(
  email: string,
  password: string
): Promise<{ token?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    console.log("Signup response status:", res.status);
    console.log("Signup response JSON:", data);

    if (!res.ok || !data.token) {
      return {
        token: undefined,
        error: data?.error || "Signup failed",
      };
    }

    saveToken(data.token);
    return { token: data.token }; // ✅ Return token here
  } catch (err) {
    console.error("Network error during signup:", err);
    return { token: undefined, error: "Network error during signup" };
  }
}


// Login user via backend
export async function authenticate(email: string, password: string): Promise<{ ok: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Response status:", res.status);

    const data = await res.json();
    console.log("Response JSON:", data);

    if (!res.ok) {
      return { ok: false, error: data.error || "Login failed" };
    }

    if (!data.token) {
      return { ok: false, error: "No token received from server." };
    }

    saveToken(data.token); // if you still want to save it here
    return { ok: true, token: data.token };  // <-- Return token here
  } catch (error) {
    console.error("Network error during login:", error);
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
