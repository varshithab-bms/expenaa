export interface User {
  email: string;
  password: string;
}

export interface Expense {
  id: string;         // mapped from _id
  userId: string;     // backend userId field
  title: string;
  category: string;
  amount: number;
  date: string;
}

export type NewExpense = Omit<Expense, "id" | "userId">;

export interface Profile {
  id?: string;       // Optional if backend sends an id
  email?: string;    // Optional or required based on your backend design
  name: string;
  bio: string;
  photo: string;
}

export type AuthResult = {
  ok: boolean;
  token?: string;
  error?: string;
};
