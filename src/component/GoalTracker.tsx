import React, { useState } from "react";
import { Expense } from "../types";

interface GoalTrackerProps {
  expenses: Expense[];
  userEmail: string;
  loading?: boolean;
}

const getRandomEncouragement = () => {
  const lines = [
    "Slay that budget, bestie! 💅",
    "You got this, money magician! 🪄",
    "Keep flexing those saving skills! 💪",
    "Wallet looking THICC? Keep it up! 🤑",
    "Budget game: ON FLEEK 🔥",
    "Spending less, living more. Yasss! 🙌",
  ];
  return lines[Math.floor(Math.random() * lines.length)];
};

const getRandomOops = () => {
  const lines = [
    "Oops, you did it again... 💸",
    "Budget? Never heard of her. 😬",
    "Spending spree unlocked! 🚨",
    "RIP to your goal, but you still look cute. 😅",
    "Big spender energy detected! 💥",
    "Time to eat noodles for a week. 🍜",
  ];
  return lines[Math.floor(Math.random() * lines.length)];
};

const GoalTracker: React.FC<GoalTrackerProps> = ({
  expenses,
  userEmail,
  loading = false,
}) => {
  const [goal, setGoal] = useState<number>(() => {
    const saved = localStorage.getItem(`${userEmail}-goal`);
    const parsed = parseFloat(saved || "");
    return !isNaN(parsed) ? parsed : 0;
  });

  const [newGoalInput, setNewGoalInput] = useState<string>("");

  const setNewGoal = (g: number) => {
    const roundedGoal = parseFloat(g.toFixed(2));
    setGoal(roundedGoal);
    localStorage.setItem(`${userEmail}-goal`, roundedGoal.toString());
    setNewGoalInput("");
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalSpent = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return (
        !isNaN(d.getTime()) &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    })
    .reduce((acc, e) => acc + e.amount, 0);

  const percentage = goal > 0 ? Math.min((totalSpent / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - totalSpent, 0);

  const barColor =
    totalSpent === 0
      ? "#bdbdbd"
      : totalSpent < goal * 0.5
      ? "#6C63FF"
      : totalSpent < goal
      ? "#ffc658"
      : "#ff4d6d";

  return (
    <div
      style={{
        margin: "1.5rem 0",
        textAlign: "center",
        background: "linear-gradient(120deg, #f0f4ff 0%, #ffe8f7 100%)",
        borderRadius: "1rem",
        boxShadow: "0 8px 32px rgba(255, 105, 180, 0.10)",
        padding: "2.5rem 1.5rem",
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
        fontFamily: "'Poppins', 'Comic Sans MS', cursive, sans-serif",
      }}
    >
      <h3
        style={{
          fontSize: "1rem",
          color: "#6C63FF",
          fontWeight: 900,
          letterSpacing: "1px",
          marginBottom: "1rem",
        }}
      >
        🎯 Monthly Money Mission
      </h3>

      {loading ? (
        <p style={{ color: "#999", fontWeight: 700, fontSize: "1.1rem" }}>
          Loading expenses...
        </p>
      ) : goal === 0 ? (
        <div>
          <p style={{ color: "#b347a8", fontWeight: 700, fontSize: "1rem" }}>
            No goal yet. Manifest your budget vibes below:
          </p>
          <input
            type="number"
            value={newGoalInput}
            onChange={(e) => setNewGoalInput(e.target.value)}
            placeholder="How much you tryna save? 💰"
            style={{
              padding: "0.7rem 1rem",
              borderRadius: "12px",
              border: "2px solid #6C63FF",
              fontSize: "0.8rem",
              marginRight: "0.5rem",
              outline: "none",
              marginBottom: "1rem",
              fontWeight: 600,
              background: "#fff8ff",
              color: "#6C63FF",
            }}
          />
          <button
            onClick={() => {
              const value = parseFloat(newGoalInput);
              if (value > 0) setNewGoal(value);
            }}
            style={{
              padding: "0.7rem 1.4rem",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #6C63FF 0%, #ff69b4 100%)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.1rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 8px #ffb6c1",
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.06)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            Set Goal 🚀
          </button>
        </div>
      ) : (
        <div>
          <div
            style={{
              fontSize: "1.15rem",
              marginBottom: "0.7rem",
              color: "#b347a8",
              fontWeight: 700,
            }}
          >
            <span>Goal: </span>
            <span style={{ color: "#6C63FF" }}>₹{goal.toFixed(2)}</span>
          </div>
          <div
            style={{
              fontSize: "1.12rem",
              marginBottom: "0.7rem",
              color: "#ff69b4",
              fontWeight: 700,
            }}
          >
            <span>Spent: </span>
            <span style={{ color: "#ff4d6d" }}>
              ₹{totalSpent.toFixed(2)}
            </span>{" "}
            <span>({percentage.toFixed(1)}%)</span>
          </div>
          <div
            style={{
              fontSize: "1.12rem",
              marginBottom: "1.2rem",
              color: "#82ca9d",
              fontWeight: 700,
            }}
          >
            <span>Remaining: </span>
            <span style={{ color: "#2a7a3b" }}>
              ₹{remaining.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              position: "relative",
              width: "85%",
              margin: "0.7rem auto 1.2rem",
              height: 28,
              background: "#f0f0ff",
              borderRadius: 18,
              boxShadow: "0 2px 8px #ffb6c1",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${percentage}%`,
                maxWidth: "100%",
                height: "100%",
                background: `linear-gradient(90deg, ${barColor}, #fff)`,
                borderRadius: 18,
                transition: "width 0.4s ease-in-out",
                boxShadow:
                  totalSpent > goal
                    ? "0 0 20px #ff4d6d88"
                    : "0 0 12px #6C63FF55",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: 800,
                color: totalSpent > goal ? "#ff4d6d" : "#6C63FF",
                fontSize: "1.1rem",
                letterSpacing: "1px",
                userSelect: "none",
              }}
            >
              {percentage.toFixed(0)}%
            </span>
          </div>
          <div style={{ margin: "1.4rem 0 0.6rem", fontSize: "1.08rem" }}>
            {totalSpent > goal ? (
              <span style={{ color: "#ff4d6d", fontWeight: 800 }}>
                {getRandomOops()}
              </span>
            ) : (
              <span style={{ color: "#6C63FF", fontWeight: 800 }}>
                {getRandomEncouragement()}
              </span>
            )}
          </div>
          <button
            onClick={() => setNewGoal(0)}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.3rem",
              borderRadius: "10px",
              background: "linear-gradient(90deg, #ff69b4 0%, #6C63FF 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 8px #b347a8",
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.06)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            Reset Goal 🔄
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;
