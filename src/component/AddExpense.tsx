import React, { useState } from "react";
import { NewExpense } from "../types";

const CATEGORIES = [
  "Snacks 🍕",
  "Coffee ☕️",
  "Shopping 🛍️",
  "Groceries 🥦",
  "Bills 💡",
  "Transport 🚗",
  "Entertainment 🎮",
  "Custom..."
];

interface AddExpenseProps {
  addExpense: (expense: NewExpense) => void;
}

const formStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "14px",
  marginBottom: 28,
  backgroundColor: "#f7f8ff",
  padding: "20px",
  borderRadius: "18px",
  boxShadow: "0 6px 24px rgba(108, 99, 255, 0.08)",
  maxWidth: "540px",
  alignItems: "center",
  justifyContent: "center"
};

const inputStyle: React.CSSProperties = {
  flex: "1 1 140px",
  padding: "12px 14px",
  border: "2px solid #e0e4ff",
  borderRadius: "10px",
  fontSize: "1rem",
  transition: "border-color 0.2s",
  background: "#fff",
  fontWeight: 500
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer"
};

const buttonStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #6c63ff 0%, #82ca9d 100%)",
  color: "white",
  border: "none",
  padding: "13px 30px",
  borderRadius: "50px",
  fontSize: "0.8rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 2px 12px rgba(108, 99, 255, 0.14)",
  transition: "transform 0.18s, box-shadow 0.18s"
};

const helperStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "center",
  color: "#8884d8",
  marginTop: "0.5rem",
  fontSize: "0.9rem",
  fontStyle: "italic"
};

const AddExpense: React.FC<AddExpenseProps> = ({ addExpense }) => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const isCustom = category === "Custom...";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isCustom ? customCategory : category;
    if (!finalCategory || !amount || !date) return;
    addExpense({
      category: finalCategory,
      amount: parseFloat(amount),
      date,
      title: finalCategory,
    });
    setCategory(CATEGORIES[0]);
    setCustomCategory("");
    setAmount("");
    setDate("");
  };

  // Focus style helper
  const getInputStyle = (field: string) => ({
    ...inputStyle,
    borderColor: focused === field ? "#6c63ff" : "#e0e4ff",
    boxShadow: focused === field ? "0 0 0 2px #6c63ff22" : undefined,
    outline: "none"
  });

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <span style={{
        width: "100%",
        textAlign: "center",
        fontWeight: 700,
        fontSize: "1.25rem",
        color: "#6c63ff",
        marginBottom: "0.2rem",
        letterSpacing: "1px"
      }}>
        What did you <em>just</em> spend money on? 👀
      </span>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={selectStyle}
        onFocus={() => setFocused("category")}
        onBlur={() => setFocused(null)}
        required
      >
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      {isCustom && (
        <input
          type="text"
          placeholder="Type your own category"
          value={customCategory}
          onChange={e => setCustomCategory(e.target.value)}
          style={getInputStyle("customCategory")}
          onFocus={() => setFocused("customCategory")}
          onBlur={() => setFocused(null)}
          required
        />
      )}
      <input
        type="number"
        placeholder="How much? (in ₹, be honest 😅)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        min="0.01"
        step="0.01"
        style={getInputStyle("amount")}
        onFocus={() => setFocused("amount")}
        onBlur={() => setFocused(null)}
      />
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
        style={getInputStyle("date")}
        onFocus={() => setFocused("date")}
        onBlur={() => setFocused(null)}
      />
      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={e => {
          e.currentTarget.style.transform = "scale(1.07)";
          e.currentTarget.style.boxShadow = "0 4px 18px rgba(108,99,255,0.25)";
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(108,99,255,0.14)";
        }}
      >
        Add it! 🚀
      </button>
      <div style={helperStyle}>
        {amount && parseFloat(amount) > 1000
          ? "Whoa, big spender! 💸 (That's a lot of ₹₹₹!)"
          : "Tracking now = more chai later. ☕️"}
      </div>
    </form>
  );
};

export default AddExpense;
