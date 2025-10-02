import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch("https://finance-tracker-backend-fdrs.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful! Redirecting...");
        setMessageType("success");

        setTimeout(() => {
          onLogin(data.user);
        }, 1500);
      } else {
        setMessage(data.error);
        setMessageType("error");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Something went wrong. Try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

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
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
