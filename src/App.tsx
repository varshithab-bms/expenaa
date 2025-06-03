import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Budget from "./component/Budget";
import AddExpense from "./component/AddExpense";
import ExpenseList from "./component/ExpenseList";
import Login from "./component/Login";
import Homepage from "./component/Homepage";
import Analytics from "./component/Analytics";
import GoalTracker from "./component/GoalTracker";
import ProfilePage from "./component/ProfilePage";
import { Expense,AuthResult, NewExpense } from "./types";
import { Profile } from "./types"; // Adjust path if needed
import { getToken, authenticate, register, logout as apiLogout } from "./utils/auth";
import { getExpenses, addExpense, deleteExpense } from "./utils/expenses";

// Import icons from react-icons
import { MdDashboard } from "react-icons/md";
import { FaChartBar, FaBullseye, FaUserCircle } from "react-icons/fa";

const EMAIL_KEY = "user_email";
const TOKEN_KEY = "auth_token";

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showHomepage, setShowHomepage] = useState<boolean>(true);

  // Load email and token on mount, then fetch expenses if token found
  useEffect(() => {
    const email = localStorage.getItem(EMAIL_KEY);
    const storedToken = getToken();

    if (email && storedToken) {
      setUserEmail(email);
      setToken(storedToken);
      setShowHomepage(false);

      // Fetch expenses only after setting token state
      fetchExpenses(storedToken);
    }
  }, []); // Run once on mount

  // Fetch expenses from backend using token
  const fetchExpenses = async (authToken: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExpenses(authToken);
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  // Handle login/signup
  const handleLogin = async (
  email: string,
  password: string,
  isSignup: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = isSignup
      ? await register(email, password)
      : await authenticate(email, password);
    console.log("Auth result:", result);
    
    if (!result.token) {
      return {
        success: false,
        error: result.error ?? "Authentication failed",
      };
    }

    localStorage.setItem(EMAIL_KEY, email);
    localStorage.setItem(TOKEN_KEY, result.token);

    setUserEmail(email);
    setToken(result.token);
    setShowHomepage(false);

    await fetchExpenses(result.token);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

  // Add expense via backend
  const handleAddExpense = async (expense: NewExpense): Promise<void> => {
    if (!token) {
      setError("User not authenticated");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addExpense(token, expense);
      await fetchExpenses(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  // Delete expense via backend
  const handleDeleteExpense = async (id: string): Promise<void> => {
    if (!token) {
      setError("User not authenticated");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await deleteExpense(token, id);
      await fetchExpenses(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async (): Promise<void> => {
    await apiLogout();
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUserEmail(null);
    setToken(null);
    setExpenses([]);
    setShowHomepage(true);
  };

  // Show homepage splash before login
  if (showHomepage) {
    return <Homepage onContinue={() => setShowHomepage(false)} />;
  }
  

  // Show login if no email or token
  if (!userEmail || !token) {
    return <Login onLogin={handleLogin} />;
  }

  // Main app UI with navigation and routes
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
                <ExpenseList expenses={expenses} deleteExpense={handleDeleteExpense} />
              </>
            }
          />
          <Route path="/analytics" element={<Analytics expenses={expenses} />} />
          <Route path="/goal" element={<GoalTracker expenses={expenses} userEmail={userEmail} />} />
          <Route path="/profile" element={<ProfilePage userEmail={userEmail} onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
