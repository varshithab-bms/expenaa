import { useState, useEffect, useRef } from 'react';
import { Expense, NewExpense } from '../types';
import {
  getExpenses as apiGetExpenses,
  addExpense as apiAddExpense,
  deleteExpense as apiDeleteExpense,
} from '../utils/expenses';

const useBudget = (token: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No token provided');
      const data = await apiGetExpenses(token);
      if (!isMounted.current) return;
      setExpenses(data);
    } catch (err: any) {
      if (!isMounted.current) return;
      setError(err.message || 'Failed to load expenses.');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    if (token) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
      setError(null);
    }
    return () => {
      isMounted.current = false;
    };
  }, [token]);

  const addExpense = async (expense: NewExpense) => {
    setError(null);
    try {
      if (!token) throw new Error('No token provided');
      await apiAddExpense(token, expense);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Failed to add expense.');
    }
  };

  const deleteExpense = async (id: string) => {
    setError(null);
    try {
      if (!token) throw new Error('No token provided');
      await apiDeleteExpense(token, id);
      if (!isMounted.current) return;
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err: any) {
      if (!isMounted.current) return;
      setError(err.message || 'Failed to delete expense.');
    }
  };

  return { expenses, addExpense, deleteExpense, loading, error };
};

export default useBudget;