import { useState, useEffect } from 'react';
import { Expense, NewExpense } from '../types';
import {
  getExpenses as apiGetExpenses,
  addExpense as apiAddExpense,
  deleteExpense as apiDeleteExpense,
} from '../utils/expenses';

const useBudget = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetExpenses();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense via backend
  const addExpense = async (expense: NewExpense) => {
    try {
      const newExpense = await apiAddExpense(expense);
      setExpenses(prev => [...prev, newExpense]);
    } catch (err: any) {
      setError(err.message || 'Failed to add expense.');
    }
  };

  // Delete expense via backend
  const deleteExpense = async (id: string) => {
    try {
      await apiDeleteExpense(id);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete expense.');
    }
  };

  return { expenses, addExpense, deleteExpense, loading, error };
};

export default useBudget;
