import { Profile } from "../types";

const API_BASE = "http://192.168.43.111:5000/api/profiles/me"; // current user's profile endpoint
const TOKEN_KEY = "auth_token";

// Helper to get JWT token
function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// GET: Fetch current user's profile
export async function getMyProfile(): Promise<Profile> {
  const token = getToken();
  if (!token) throw new Error("User not logged in");

  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

// POST: Create profile for the current user (if needed)
export async function createProfile(
  profile: Omit<Profile, "id">
): Promise<Profile> {
  const token = getToken();
  if (!token) throw new Error("User not logged in");

  // If your backend supports creating profile via POST /api/profiles/me
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });

  if (!res.ok) throw new Error("Failed to create profile");
  return res.json();
}

// PUT: Update current user's profile
export async function updateMyProfile(
  profile: Partial<Omit<Profile, "id">>
): Promise<Profile> {
  const token = getToken();
  if (!token) throw new Error("User not logged in");

  const res = await fetch(API_BASE, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

// DELETE: Delete current user's profile
export async function deleteMyProfile(): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("User not logged in");

  const res = await fetch(API_BASE, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete profile");
}
