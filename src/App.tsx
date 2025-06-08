import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import Budget from "./component/Budget";
import AddExpense from "./component/AddExpense";
import ExpenseList from "./component/ExpenseList";
import Login from "./component/Login";
import Homepage from "./component/Homepage";
import Analytics from "./component/Analytics";
import GoalTracker from "./component/GoalTracker";
import ProfilePage from "./component/ProfilePage";

import { Expense, NewExpense, Profile } from "./types";
import {
  getToken,
  authenticate,
  register,
  logout as apiLogout,
} from "./utils/auth";
import { getExpenses, addExpense, deleteExpense } from "./utils/expenses";

import { MdDashboard } from "react-icons/md";
import { FaChartBar, FaBullseye, FaUserCircle, FaBars } from "react-icons/fa";

const EMAIL_KEY = "user_email";
const TOKEN_KEY = "auth_token";

// Custom hook to get current location pathname for active link styling
function usePathname() {
  const location = useLocation();
  return location.pathname;
}

const AppContent: React.FC<{
  userEmail: string;
  token: string;
  onLogout: () => void;
}> = ({ userEmail, token, onLogout }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();

  // Fetch expenses on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getExpenses(token);
        setExpenses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load expenses");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  // Add expense handler
  const handleAddExpense = async (expense: NewExpense) => {
    setLoading(true);
    setError(null);
    try {
      await addExpense(token, expense);
      const data = await getExpenses(token);
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  // Delete expense handler
  const handleDeleteExpense = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteExpense(token, id);
      const data = await getExpenses(token);
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  // Close sidebar when clicking a nav link (mobile UX)
  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <FaUserCircle size={72} color="#6c63ff" />
          <h2>{userEmail}</h2>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav">
          <Link
            to="/"
            onClick={handleNavClick}
            className={pathname === "/" ? "active" : ""}
          >
            <MdDashboard size={24} />

          </Link>
          <Link
            to="/analytics"
            onClick={handleNavClick}
            className={pathname === "/analytics" ? "active" : ""}
          >
            <FaChartBar size={24} />
          </Link>
          <Link
            to="/goal"
            onClick={handleNavClick}
            className={pathname === "/goal" ? "active" : ""}
          >
            <FaBullseye size={24} />
          </Link>
          <Link
            to="/profile"
            onClick={handleNavClick}
            className={pathname === "/profile" ? "active" : ""}
          >
            <FaUserCircle size={24} />
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header>
          {/* Hamburger for mobile */}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <FaBars size={28} />
          </button>
          <h1>Expenza - Personalized Expense Tracker</h1>
        </header>

        {/* Loading & Error */}
        {loading && <div className="loading-text">Loading...</div>}
        {error && <div className="error-text">{error}</div>}

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
          <Route
            path="/profile"
            element={<ProfilePage userEmail={userEmail} onLogout={onLogout} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showHomepage, setShowHomepage] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem(EMAIL_KEY);
    const storedToken = getToken();

    if (email && storedToken) {
      setUserEmail(email);
      setToken(storedToken);
      setShowHomepage(false);
    }
  }, []);

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

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  };

  // Logout
  const handleLogout = async () => {
    await apiLogout();
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUserEmail(null);
    setToken(null);
    setShowHomepage(true);
  };

  if (showHomepage) {
    return <Homepage onContinue={() => setShowHomepage(false)} />;
  }

  if (!userEmail || !token) {
    return <Login onLogin={handleLogin} />;
  }

  // Wrap inside Router and render main app content
  return (
    <Router>
      <AppContent userEmail={userEmail} token={token} onLogout={handleLogout} />
    </Router>
  );
};

export default App;
