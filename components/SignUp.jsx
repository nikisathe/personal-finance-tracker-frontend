import { useState } from "react";

export default function SignUp({ onRedirectLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");       // ✅ For success/error message
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch("https://finance-tracker-backend-fdrs.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! Please login.");
        setMessageType("success");

        setTimeout(() => {
          onRedirectLogin();
        }, 1500);
      } else {
        setMessage(data.error);
        setMessageType("error");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("Something went wrong. Try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

        {/* ✅ Display Message */}
        {message && (
          <p
            className={`mb-3 text-center font-medium ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          type="password"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="button"
          onClick={handleSignUp}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
