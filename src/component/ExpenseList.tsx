import React, { useState } from "react";
import { Expense } from "../types";

interface ExpensesListProps {
  expenses: Expense[];
  deleteExpense: (id: string) => Promise<void>;
}

const COLORS = [
  "#6C63FF", "#ff69b4", "#82ca9d", "#ffc658", "#ff7f50", "#a569bd"
];

const getRandomColor = (i: number) => COLORS[i % COLORS.length];

const getRandomEmoji = () => {
  const emojis = ["🤑", "💸", "🧾", "😅", "🤳", "🔥", "✨", "👛"];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, deleteExpense }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteExpense(id);
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete expense.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(120deg, #f0f4ff 0%, #ffe8f7 100%)",
        borderRadius: "1.2rem",
        boxShadow: "0 4px 18px #6c63ff11",
        padding: "1.2rem 1.5rem",
        margin: "2rem 0",
        fontFamily: "'Poppins', 'Comic Sans MS', cursive, sans-serif",
      }}
    >
      <h3
        style={{
          color: "#6C63FF",
          fontWeight: 900,
          fontSize: "1.6rem",
          marginBottom: "1rem",
          letterSpacing: "1px",
        }}
      >
        Your Expense Feed {getRandomEmoji()}
      </h3>
      {expenses.length === 0 ? (
        <p
          style={{
            color: "#b347a8",
            fontWeight: 700,
            fontSize: "1.1rem",
            textAlign: "center",
          }}
        >
          No expenses yet. Go treat yourself (or not)! 😜
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {expenses.map((exp, i) => (
            <li
              key={exp.id}
              style={{
                marginBottom: 14,
                background: "#fff",
                borderRadius: "0.9rem",
                boxShadow: "0 2px 8px #6c63ff13",
                padding: "0.9rem 1.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderLeft: `6px solid ${getRandomColor(i)}`,
                fontSize: "1.08rem",
                fontWeight: 600,
                color: "#5a2a83",
                transition: "box-shadow 0.2s",
              }}
            >
              <span>
                <span style={{ marginRight: 8 }}>{getRandomEmoji()}</span>
                <span style={{ color: "#6C63FF", fontWeight: 700 }}>{exp.category}</span>
                <span style={{ color: "#888", margin: "0 7px" }}>•</span>
                <span>₹{exp.amount.toFixed(2)}</span>
                <span style={{ color: "#b347a8", marginLeft: 10, fontSize: "0.93rem" }}>
                  {new Date(exp.date).toLocaleDateString()}
                </span>
              </span>
              <button
                onClick={() => handleDelete(exp.id)}
                disabled={deletingId === exp.id}
                style={{
                  marginLeft: 16,
                  background: deletingId === exp.id ? "#ffe8f7" : "none",
                  border: "none",
                  color: deletingId === exp.id ? "#ccc" : "#ff4d6d",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  cursor: deletingId === exp.id ? "wait" : "pointer",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "8px",
                  transition: "background 0.2s, color 0.2s",
                }}
                title="Delete this expense"
              >
                {deletingId === exp.id ? "Deleting..." : "✖️"}
              </button>
            </li>
          ))}
        </ul>
      )}
      {deleteError && (
        <div style={{
          marginTop: 10,
          color: "#d32f2f",
          background: "#ffeaea",
          padding: "0.7rem 1rem",
          borderRadius: 8,
          textAlign: "center",
          fontWeight: 500,
        }}>
          {deleteError}
        </div>
      )}
      {expenses.length > 0 && (
        <div
          style={{
            marginTop: "1.4rem",
            color: "#8884d8",
            fontSize: "1rem",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {expenses.length > 5
            ? "Whoa, big spender! 💸"
            : "On track and on snack! 🍪"}
        </div>
      )}
    </div>
  );
};

export default ExpensesList;
