import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Budget from "./component/Budget";
import AddExpense from "./component/AddExpense";
import ExpensesList from "./component/ExpenseList";
import Login from "./component/Login";
import Homepage from "./component/Homepage";
import Analytics from "./component/Analytics";
import GoalTracker from "./component/GoalTracker";
import ProfilePage from "./component/ProfilePage";
import { Expense, NewExpense } from "./types";
import { Profile } from "./types"; // Adjust path if needed
import { authenticate, register, logout as apiLogout } from "./utils/auth";
import { getExpenses, addExpense as apiAddExpense, deleteExpense as apiDeleteExpense } from "./utils/expenses";

// Import icons from react-icons
import { MdDashboard } from "react-icons/md";
import { FaChartBar, FaBullseye, FaUserCircle } from "react-icons/fa";

const EMAIL_KEY = "user_email";

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showHomepage, setShowHomepage] = useState<boolean>(true);

  // On mount, check localStorage for user email
  useEffect(() => {
    const email = localStorage.getItem(EMAIL_KEY);
    if (email) {
      setUserEmail(email);
      setShowHomepage(false);
      fetchExpenses();
    }
    // eslint-disable-next-line
  }, []);

  // Fetch expenses from backend
  const fetchExpenses = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as Error).message || "Failed to load expenses");
      } else {
        setError("Failed to load expenses");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle login/signup with improved error handling
  const handleLogin = async (
    email: string,
    password: string,
    isSignup: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      let result;
      if (isSignup) {
        result = await register(email, password); // { ok: boolean, error?: string }
        if (!result.ok) return { success: false, error: result.error || "Signup failed." };
      } else {
        result = await authenticate(email, password); // { ok: boolean, error?: string }
        if (!result.ok) return { success: false, error: result.error || "Login failed." };
      }
      // Save email in localStorage and state
      localStorage.setItem(EMAIL_KEY, email);
      setUserEmail(email);
      setShowHomepage(false);
      await fetchExpenses();
      return { success: true };
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        return { success: false, error: (err as Error).message };
      }
      return { success: false, error: isSignup ? "Signup failed." : "Login failed." };
    }
  };

  // Add expense via backend
  const handleAddExpense = async (expense: NewExpense): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiAddExpense(expense);
      await fetchExpenses(); // Always fetch fresh data
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as Error).message || "Failed to add expense");
      } else {
        setError("Failed to add expense");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete expense via backend
  const handleDeleteExpense = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteExpense(id);
      await fetchExpenses(); // Always fetch fresh data
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as Error).message || "Failed to delete expense");
      } else {
        setError("Failed to delete expense");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async (): Promise<void> => {
    await apiLogout();
    localStorage.removeItem(EMAIL_KEY);
    setUserEmail(null);
    setExpenses([]);
    setShowHomepage(true);
  };

  // Homepage splash
  if (showHomepage) {
    return <Homepage onContinue={() => setShowHomepage(false)} />;
  }

  // Login page
  if (!userEmail) {
    return <Login onLogin={handleLogin} />;
  }

  // Main app
  return (
    <Router>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
        <h1>Expenza - Personalized Expense Tracker</h1>
        <div style={{ marginBottom: 16 }}>
          <span>
            Logged in as <b>{userEmail}</b>
          </span>
          <button style={{ marginLeft: 16 }} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Navigation */}
        <nav
          style={{
            marginBottom: 20,
            display: "flex",
            gap: 24,
            alignItems: "center",
            borderBottom: "1px solid #ddd",
            paddingBottom: 8,
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
              color: "#333",
              fontWeight: "bold",
            }}
          >
            <MdDashboard size={20} />
            Dashboard
          </Link>
          <Link
            to="/analytics"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
              color: "#333",
              fontWeight: "bold",
            }}
          >
            <FaChartBar size={20} />
            Analytics
          </Link>
          <Link
            to="/goal"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
              color: "#333",
              fontWeight: "bold",
            }}
          >
            <FaBullseye size={20} />
            Goal Tracker
          </Link>
          <Link
            to="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
              color: "#333",
              fontWeight: "bold",
            }}
          >
            <FaUserCircle size={20} />
            Profile
          </Link>
        </nav>

        {/* Loading and Error States */}
        {loading && <div style={{ color: "#6c63ff", marginBottom: 10 }}>Loading...</div>}
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Budget expenses={expenses} loading={loading} />
                <AddExpense addExpense={handleAddExpense} />
                <ExpensesList expenses={expenses} deleteExpense={handleDeleteExpense} />
              </>
            }
          />
          <Route path="/analytics" element={<Analytics expenses={expenses} />} />
          <Route path="/goal" element={<GoalTracker expenses={expenses} userEmail={userEmail!} />} />
          <Route
            path="/profile"
            element={<ProfilePage userEmail={userEmail!} onLogout={handleLogout} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
