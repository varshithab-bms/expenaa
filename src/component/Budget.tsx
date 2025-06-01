import React from 'react';
import { Expense } from '../types';

interface BudgetProps {
  expenses: Expense[];
  loading?: boolean;
}

const getRandomEmoji = () => {
  const emojis = ["💸", "🤑", "🤯", "😎", "✨", "🔥", "🙌", "🥳"];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const getBudgetMessage = (total: number) => {
  if (total === 0) return "No expenses yet. Your wallet is THRIVING! 💚";
  if (total < 500) return "Still chillin'! Keep it up! 😎";
  if (total < 2000) return "You’re spending, but you’re vibing! ✨";
  if (total < 5000) return "Whoa, slow down big spender! 💸";
  return "Budget BOSS, but maybe take a breather? 🤯";
};

const Budget: React.FC<BudgetProps> = ({ expenses, loading = false }) => {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div
      style={{
        marginBottom: 24,
        background: 'linear-gradient(90deg, #f0f4ff 0%, #ffe8f7 100%)',
        padding: 22,
        borderRadius: 18,
        boxShadow: "0 4px 18px #6c63ff11",
        textAlign: "center",
        fontFamily: "'Poppins', 'Comic Sans MS', cursive, sans-serif",
      }}
    >
      <h2
        style={{
          color: "#6C63FF",
          fontWeight: 900,
          fontSize: "2rem",
          marginBottom: "0.7rem",
          letterSpacing: "1px",
        }}
      >
        {loading ? "Calculating..." : (
          <>
            Total Expenses: <span style={{ color: "#ff69b4" }}>₹{total.toFixed(2)}</span> {getRandomEmoji()}
          </>
        )}
      </h2>
      {!loading && (
        <div
          style={{
            color: "#8884d8",
            fontWeight: 700,
            fontSize: "1.1rem",
            marginTop: "0.5rem",
          }}
        >
          {getBudgetMessage(total)}
        </div>
      )}
    </div>
  );
};

export default Budget;
