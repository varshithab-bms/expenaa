import { Expense, NewExpense } from "../types";
const API_BASE = "https://expenza.loca.lt/api/expenses"

async function parseJSONSafe(res: Response) {
  const text = await res.text();
  console.log("Response text from server:", text);
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    return null;
  }
}

function mapBackendExpense(backendExp: any): Expense {
  return {
    id: backendExp._id,
    userId: backendExp.userId,
    title: backendExp.title,
    amount: backendExp.amount,
    category: backendExp.category,
    date: backendExp.date,
  };
}

export const getExpenses = async (token: string): Promise<Expense[]> => {
  const res = await fetch(API_BASE, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  console.log("Raw response text:", text);  // Log raw text
  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      throw new Error(data.error || `Failed to fetch expenses (status ${res.status})`);
    }
    if (Array.isArray(data)) {
      return data.map(mapBackendExpense);
    } else if (data.expenses && Array.isArray(data.expenses)) {
      return data.expenses.map(mapBackendExpense);
    } else {
      throw new Error("Unexpected response format: expenses data is not an array");
    }
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    throw new Error("Failed to parse response as JSON. Response was:\n" + text);
  }
};

export const addExpense = async (token: string, expense: NewExpense): Promise<Expense> => {
  if (!token) throw new Error("User not logged in");
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });
  const backendExpense = await parseJSONSafe(res);
  if (!res.ok) {
    throw new Error(backendExpense?.error || `Failed to add expense (status ${res.status})`);
  }
  if (!backendExpense) throw new Error("Failed to parse added expense from server.");

  return mapBackendExpense(backendExpense);
};

export const deleteExpense = async (token: string, expenseId: string): Promise<void> => {
  if (!token) throw new Error("User not logged in");
  if (!expenseId) throw new Error("Expense ID is required");
  const res = await fetch(`${API_BASE}/${expenseId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await parseJSONSafe(res);
  if (!res.ok) {
    throw new Error(data?.error || `Failed to delete expense (status ${res.status})`);
  }
};