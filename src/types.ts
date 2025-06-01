export interface User {
  email: string;
  password: string;
}
export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  title: string;
  userEmail?: string; // Only present in backend response
}

export type NewExpense = Omit<Expense, "id" | "userEmail">;


export interface Profile {
  id?: string;       // Optional if backend sends an id
  email?: string;    // Optional or required based on your backend design
  name: string;
  bio: string;
  photo: string;
}
