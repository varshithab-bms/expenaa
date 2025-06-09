import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import './App.css'; // Or your CSS file name
import Budget from "./component/Budget";
import AddExpense from "./component/AddExpense";
import ExpenseList from "./component/ExpenseList";
import Login from "./component/Login";
import Homepage from "./component/Homepage";
import Analytics from "./component/Analytics";
import GoalTracker from "./component/GoalTracker";
import ProfilePage from "./component/ProfilePage";

import { Expense, NewExpense } from "./types";
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

// Custom hook for current pathname (for active link styling)
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

  useEffect(() => {
    async function fetchExpenses() {
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
    fetchExpenses();
  }, [token]);

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

  const handleNavClick = () => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <div className="app-wrapper">
      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`} aria-label="Sidebar Navigation">
        <div className="sidebar-header">
          <h2 className="sidebar-email" tabIndex={0}>{userEmail}</h2>
          <button
            className="logout-btn button"
            onClick={onLogout}
            aria-label="Logout"
            type="button"
          >
            Logout
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="Main Navigation">
          <Link
            to="/"
            onClick={handleNavClick}
            className={pathname === "/" ? "active" : ""}
            aria-current={pathname === "/" ? "page" : undefined}
            title="Dashboard"
          >
            <MdDashboard aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/analytics"
            onClick={handleNavClick}
            className={pathname === "/analytics" ? "active" : ""}
            aria-current={pathname === "/analytics" ? "page" : undefined}
            title="Analytics"
          >
            <FaChartBar aria-hidden="true" />
            <span>Analytics</span>
          </Link>
          <Link
            to="/goal"
            onClick={handleNavClick}
            className={pathname === "/goal" ? "active" : ""}
            aria-current={pathname === "/goal" ? "page" : undefined}
            title="Goal Tracker"
          >
            <FaBullseye aria-hidden="true" />
            <span>Goal Tracker</span>
          </Link>
          <Link
            to="/profile"
            onClick={handleNavClick}
            className={pathname === "/profile" ? "active" : ""}
            aria-current={pathname === "/profile" ? "page" : undefined}
            title="Profile"
          >
            <FaUserCircle aria-hidden="true" />
            <span>Profile</span>
          </Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="main-content" role="main">
        <header className="main-header">
          <button
            className="sidebar-toggle button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle sidebar navigation"
            aria-expanded={sidebarOpen}
            type="button"
          >
            <FaBars aria-hidden="true" />
          </button>
         <h1 style={{ fontSize: '28px' }}>
               Expenza <span className="subtitle" style={{ fontSize: '22px' }}>
                                  Personalized Expense Tracker
          </span>
        </h1>
        </header>
        {loading && <div className="loading-text" role="status" aria-live="polite">Loading...</div>}
        {error && <div className="error-text" role="alert">{error}</div>}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Budget expenses={expenses} loading={loading} />
                <AddExpense addExpense={handleAddExpense} />
                <ExpenseList
                  expenses={expenses}
                  deleteExpense={handleDeleteExpense}
                />
              </>
            }
          />
          <Route path="/analytics" element={<Analytics expenses={expenses} />} />
          <Route
            path="/goal"
            element={<GoalTracker expenses={expenses} userEmail={userEmail} />}
          />
          <Route
            path="/profile"
            element={<ProfilePage userEmail={userEmail} onLogout={onLogout} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
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
        return { success: false, error: result.error ?? "Authentication failed" };
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

  return (
    <Router>
      <AppContent userEmail={userEmail} token={token} onLogout={handleLogout} />
    </Router>
  );
};

export default App;
