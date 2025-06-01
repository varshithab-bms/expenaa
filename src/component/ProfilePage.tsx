import React, { useState, useRef, useEffect } from "react";

interface ProfileProps {
  userEmail: string;
  onLogout: () => void;
}

interface Profile {
  name: string;
  bio: string;
  photo: string;
}

const ProfilePage: React.FC<ProfileProps> = ({ userEmail, onLogout }) => {
  const [profile, setProfile] = useState<Profile>({ name: "", bio: "", photo: "" });
  const [editing, setEditing] = useState(true);
  const [photoPreview, setPhotoPreview] = useState("");
  const [goalFulfilled, setGoalFulfilled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Helpers for localStorage keys
  const profileKey = `profile_${userEmail}`;
  const goalKey = `goal_fulfilled_${userEmail}`;

  // Fetch profile & goal from localStorage on mount
  useEffect(() => {
    setLoading(true);
    // Get profile
    const profileStr = localStorage.getItem(profileKey);
    if (profileStr) {
      try {
        const data = JSON.parse(profileStr);
        setProfile(data);
        setPhotoPreview(data.photo || "");
        setEditing(!data.name); // Start editing if no name yet
      } catch {
        // If parsing fails, reset profile
        setProfile({ name: "", bio: "", photo: "" });
        setPhotoPreview("");
        setEditing(true);
      }
    } else {
      setProfile({ name: "", bio: "", photo: "" });
      setPhotoPreview("");
      setEditing(true);
    }
    // Get goal fulfilled status
    const goal = localStorage.getItem(goalKey);
    setGoalFulfilled(goal === "true");
    setLoading(false);
    // eslint-disable-next-line
  }, [userEmail]);

  // Handle photo change locally and in state
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const result = ev.target?.result as string;
        setProfile(p => ({ ...p, photo: result }));
        setPhotoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile to localStorage
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem(profileKey, JSON.stringify(profile));
      setEditing(false);
    } catch (error) {
      alert("Error saving profile. Please try again.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading profile...</p>;

  return (
    <div
      style={{
        maxWidth: 430,
        margin: "3rem auto",
        background: "linear-gradient(120deg,#fff8ff 0%,#e0ffe0 100%)",
        borderRadius: 22,
        boxShadow: "0 8px 32px #6c63ff22",
        padding: "2.4rem 1.7rem",
        fontFamily: "'Poppins', 'Comic Sans MS', cursive, sans-serif",
        color: "#5a2a83",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          background: "#fff0f6",
          border: "none",
          borderRadius: "8px",
          padding: "0.4rem 1rem",
          color: "#ff4d6d",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: "1rem",
        }}
        aria-label="Logout"
      >
        Logout
      </button>

      <h2
        style={{
          fontWeight: 900,
          fontSize: "2.2rem",
          marginBottom: "0.8rem",
          letterSpacing: "1.5px",
        }}
      >
        {profile.name ? `Hey, ${profile.name}!` : "Your Profile"}
      </h2>

      {/* Goal badge */}
      {goalFulfilled && (
        <div
          style={{
            fontSize: "2.5rem",
            marginBottom: "1.2rem",
            color: "#ffc658",
            textShadow: "0 2px 10px #ffc65888",
            fontWeight: 900,
          }}
          aria-label="Star badge"
        >
          ⭐ <span style={{ fontSize: "1.2rem", color: "#6C63FF" }}>Goal Slayer!</span>
        </div>
      )}

      {/* Profile Picture */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            margin: "0 auto 0.7rem",
            width: 110,
            height: 110,
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 2px 12px #6c63ff33",
            background: "#e0e0e0",
            cursor: editing ? "pointer" : "default",
            border: editing ? "3px dashed #6C63FF" : "3px solid #fff",
            transition: "border 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          onClick={() => editing && fileInputRef.current?.click()}
          tabIndex={0}
          aria-label="Profile photo"
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                color: "#fff",
                fontSize: "2.6rem",
                fontWeight: 900,
                background: "#6C63FF",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {profile.name ? profile.name[0].toUpperCase() : "👤"}
            </span>
          )}
          {editing && (
            <span
              style={{
                position: "absolute",
                bottom: 5,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#fff0f6",
                color: "#ff69b4",
                fontSize: "0.95rem",
                fontWeight: 700,
                borderRadius: "8px",
                padding: "2px 10px",
              }}
            >
              {photoPreview ? "Change" : "Add"} Photo
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
            aria-label="Upload profile photo"
          />
        </div>
      </div>

      {/* Editable Form */}
      {editing ? (
        <form onSubmit={handleSave} style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            value={profile.name}
            onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            placeholder="Your Name"
            required
            disabled={saving}
            style={{
              width: "90%",
              padding: "0.7rem",
              borderRadius: "10px",
              border: "2px solid #6C63FF",
              fontSize: "1.08rem",
              marginBottom: "0.7rem",
              fontWeight: 700,
              background: "#fff",
              color: "#6C63FF",
            }}
          />
          <textarea
            value={profile.bio}
            onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
            placeholder="Tell us something fun about you!"
            rows={3}
            maxLength={120}
            disabled={saving}
            style={{
              width: "90%",
              padding: "0.7rem",
              borderRadius: "10px",
              border: "2px solid #ffc658",
              fontSize: "1.05rem",
              marginBottom: "0.7rem",
              fontWeight: 500,
              background: "#fff",
              color: "#b347a8",
              resize: "none",
            }}
          />
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "0.7rem 2.1rem",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #6C63FF 0%, #ffc658 100%)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.1rem",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              marginTop: "0.4rem",
              boxShadow: "0 2px 8px #ffc65888",
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseOver={e => !saving && (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {saving ? "Saving..." : "Save Profile 🚀"}
          </button>
        </form>
      ) : (
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#6C63FF",
              marginBottom: "0.5rem",
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontSize: "1.05rem",
              color: "#b347a8",
              marginBottom: "1.1rem",
              fontStyle: "italic",
            }}
          >
            {profile.bio || "No bio yet. Edit profile and flex your personality!"}
          </div>
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: "0.5rem 1.6rem",
              borderRadius: "10px",
              background: "linear-gradient(90deg, #ffc658 0%, #6C63FF 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 8px #6c63ff44",
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
