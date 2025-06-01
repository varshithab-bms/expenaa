import { Expense } from "../types";

const API_BASE = "http://192.168.43.111:5000/api/expenses"; // or your deployed URL
const TOKEN_KEY = "auth_token";

// Helper to get JWT token
function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// GET: Fetch expenses from backend
export async function getExpenses(): Promise<Expense[]> {
  const token = getToken();
  if (!token) throw new Error("User not logged in");

  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

// POST: Add new expense
export async function addExpense(
  expense: Omit<Expense, "id" | "userEmail">
): Promise<Expense> {
  const token = getToken();
  if (!token) throw new Error("User not logged in");

  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });

  if (!res.ok) throw new Error("Failed to add expense");
  return res.json();
}

// DELETE: Delete expense by ID
export async function deleteExpense(expenseId: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("User not logged in");

  const res = await fetch(`${API_BASE}/${expenseId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete expense");
}
