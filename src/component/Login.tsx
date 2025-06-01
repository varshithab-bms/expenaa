import React, { useState } from "react";

interface LoginProps {
  onLogin: (
    email: string,
    password: string,
    isSignup: boolean
  ) => Promise<{ success: boolean; error?: string }>;
}

const inputStyle: React.CSSProperties = {
  marginBottom: 14,
  width: "100%",
  padding: "0.85rem 1rem",
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

const submitButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.9rem",
  background: "linear-gradient(90deg, #6C63FF 0%, #82ca9d 100%)",
  color: "#fff",
  fontWeight: 700,
  fontSize: "1.1rem",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  marginBottom: "0.5rem",
};

const toggleButtonStyle: React.CSSProperties = {
  marginTop: 6,
  width: "100%",
  padding: "0.7rem",
  background: "none",
  border: "none",
  color: "#6C63FF",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  textDecoration: "underline",
};

const errorStyle: React.CSSProperties = {
  marginTop: 18,
  background: "#ffeaea",
  color: "#d32f2f",
  padding: "0.8rem 1rem",
  borderRadius: 7,
  textAlign: "center",
  fontWeight: 500,
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await onLogin(email.trim(), password, isSignup);
      if (!result.success) {
        setError(result.error || (isSignup ? "Signup failed." : "Login failed."));
      }
    } catch {
      setError(isSignup ? "Signup failed." : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f3e7e9 0%, #e3eeff 100%)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2.5rem 2rem",
          borderRadius: 18,
          boxShadow: "0 6px 32px rgba(136,132,216,0.15)",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: 800,
            color: "#6C63FF",
            marginBottom: "0.5rem",
            fontSize: "2rem",
          }}
        >
          Welcome to Expenza
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#888",
            marginBottom: "2rem",
            fontSize: "1.05rem",
          }}
        >
          {isSignup ? "Create your account to get started" : "Login to your account"}
        </p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            autoFocus
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={submitButtonStyle} disabled={loading}>
            {loading
              ? isSignup
                ? "Signing Up..."
                : "Logging In..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </form>
        <button
          style={toggleButtonStyle}
          type="button"
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
        >
          {isSignup ? "Already have an account? Login" : "No account? Sign Up"}
        </button>
        {error && <div style={errorStyle}>{error}</div>}
      </div>
    </div>
  );
};

export default Login;
