import React, { useMemo } from "react";
import { FaWallet, FaSmile, FaArrowCircleRight } from "react-icons/fa";

const GENZ_QUOTES = [
  "Money can't buy happiness, but it can buy snacks. Same thing, right? 🍕",
  "Why save money when you can just refresh your bank app and hope for the best? 🤞",
  "Adulting is just Googling ‘how to budget’ every month. 📱💸",
  "Spent all my money on coffee, but at least I’m energized to be broke! ☕️😂",
  "Budget? I thought you said ‘budget cuts’... like in my social life. ✂️💀",
  "I have a black belt in online shopping and a white belt in saving money. 🥋🛍️",
  "Money talks, but mine just says ‘Goodbye!’ 👋💸",
];

const getRandomQuote = () =>
  GENZ_QUOTES[Math.floor(Math.random() * GENZ_QUOTES.length)];

const Homepage: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const quote = useMemo(() => getRandomQuote(), []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #d9e8ff 50%, #a0c1ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        fontFamily:
          "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          background: "white",
          borderRadius: "1.5rem",
          boxShadow:
            "0 12px 30px rgba(100, 99, 255, 0.15), 0 0 0 6px #6c63ff33",
          padding: "3rem 2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative frame corners */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            width: 40,
            height: 40,
            borderTop: "4px solid #6c63ff",
            borderLeft: "4px solid #6c63ff",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 40,
            height: 40,
            borderTop: "4px solid #82ca9d",
            borderRight: "4px solid #82ca9d",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            width: 40,
            height: 40,
            borderBottom: "4px solid #ffc658",
            borderLeft: "4px solid #ffc658",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            width: 40,
            height: 40,
            borderBottom: "4px solid #ff7f50",
            borderRight: "4px solid #ff7f50",
            borderRadius: "8px",
          }}
        />

        {/* Header with icon */}
        <h1
          style={{
            fontSize: "2rem",
            color: "#6c63ff",
            fontWeight: "900",
            marginBottom: "1rem",
            textAlign: "center",
            letterSpacing: "2px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <FaWallet /> Welcome to Expenza
        </h1>

        {/* Tagline with icon */}
        <p
          style={{
            fontSize: "1.3rem",
            color: "#444",
            fontWeight: "600",
            textAlign: "center",
            marginBottom: "2rem",
            lineHeight: 1.4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Your personal expense tracker - but make it fun. <FaSmile  color="#6c63ff" />
        </p>

        <blockquote
          style={{
            fontSize: "1.1rem",
            fontStyle: "italic",
            color: "#6c63ff",
            backgroundColor: "#f0f0ff",
            borderLeft: "6px solid #6c63ff",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            maxWidth: 460,
            margin: "0 auto 3rem",
            boxShadow: "0 4px 15px rgba(108, 99, 255, 0.1)",
            userSelect: "none",
          }}
        >
          {quote}
        </blockquote>

        <button
          aria-label="Get started with Expenza"
          onClick={onContinue}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: "0 auto",
            padding: "1rem 3rem",
            fontSize: "1.2rem",
            fontWeight: "700",
            color: "white",
            background:
              "linear-gradient(90deg, #6c63ff 0%, #82ca9d 100%)",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(108, 99, 255, 0.3)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(108, 99, 255, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(108, 99, 255, 0.3)";
          }}
        >
          Get Started <FaArrowCircleRight  />
        </button>
      </div>
    </main>
  );
};

export default Homepage;
