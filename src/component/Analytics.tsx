import React from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Expense } from "../types";

const COLORS = ["#6C63FF", "#82ca9d", "#ffc658", "#ff7f50", "#a569bd"];

interface AnalyticsProps {
  expenses: Expense[];
}

const Analytics: React.FC<AnalyticsProps> = ({ expenses }) => {
  const currentMonth = new Date().getMonth();
  const monthlyExpenses = expenses.filter(
    (e) => new Date(e.date).getMonth() === currentMonth
  );

  // Daily totals, sorted by date
  const dailyTotals = monthlyExpenses.reduce<Record<string, number>>((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + exp.amount;
    return acc;
  }, {});

  // Sort dates for line chart
  const lineData = Object.entries(dailyTotals)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Category totals for pie chart
  const categoryTotals = monthlyExpenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  const pieData = Object.entries(categoryTotals).map(([category, value]) => ({ name: category, value }));

  const hasData = monthlyExpenses.length > 0;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#fff8ff",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(255, 182, 193, 0.3)",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        color: "#5a2a83",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: "900",
          fontSize: "1rem",
          marginBottom: "1rem",
          textShadow: "2px 2px 6px #ffb6c1",
        }}
      >
        📊 Your Money Moves, But Make It Fun! 🎉
      </h2>

      {!hasData ? (
        <div style={{ textAlign: "center", color: "#888", fontSize: "1.3rem", margin: "2rem 0" }}>
          No expenses recorded for this month yet. Start tracking to see your analytics!
        </div>
      ) : (
        <>
          <section style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                color: "#ff69b4",
                marginBottom: "1rem",
                borderBottom: "3px dashed #ff69b4",
                paddingBottom: "0.3rem",
              }}
            >
              Daily Spending 💸
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#b347a8", fontSize: 14, fontWeight: "bold" }}
                  tickLine={false}
                  axisLine={{ stroke: "#ff69b4" }}
                  interval="preserveStartEnd"
                  minTickGap={20}
                />
                <YAxis
                  tick={{ fill: "#b347a8", fontSize: 14, fontWeight: "bold" }}
                  tickLine={false}
                  axisLine={{ stroke: "#ff69b4" }}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff0f6",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(255,105,180,0.3)",
                    fontWeight: "bold",
                    color: "#b347a8",
                  }}
                  cursor={{ stroke: "#ff69b4", strokeWidth: 3, opacity: 0.2 }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#ff69b4"
                  strokeWidth={4}
                  dot={{ r: 7, fill: "#ff69b4", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 10, fill: "#ff1493", stroke: "#fff", strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section>
            <h3
              style={{
                fontSize: "2rem",
                color: "#82ca9d",
                marginBottom: "1rem",
                borderBottom: "3px dotted #82ca9d",
                paddingBottom: "0.3rem",
              }}
            >
              Spending by Category 🍩
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent, x, y, textAnchor }) => (
                    <text
                      x={x}
                      y={y}
                      fill="#5a2a83"
                      fontWeight="bold"
                      fontSize={14}
                      textAnchor={textAnchor}
                      dominantBaseline="central"
                    >
                      {`${name} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  )}
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={COLORS[i % COLORS.length]}
                      style={{ cursor: "pointer", transition: "transform 0.3s" }}
                      onMouseEnter={e => {
                        (e.target as SVGPathElement).style.transform = "scale(1.1)";
                        (e.target as SVGPathElement).style.filter = "drop-shadow(0 0 8px #ff69b4)";
                      }}
                      onMouseLeave={e => {
                        (e.target as SVGPathElement).style.transform = "scale(1)";
                        (e.target as SVGPathElement).style.filter = "none";
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#e0ffe0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(130, 202, 157, 0.3)",
                    fontWeight: "bold",
                    color: "#2a7a3b",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  wrapperStyle={{ fontSize: 16, color: "#5a2a83", fontWeight: "bold" }}
                  iconType="circle"
                  iconSize={14}
                />
              </PieChart>
            </ResponsiveContainer>
          </section>
        </>
      )}
    </div>
  );
};

export default Analytics;
