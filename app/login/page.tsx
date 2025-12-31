"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data = await login(email, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/journals");
    } else {
      setError(data.message || "Login failed");
    }
  };

return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-3xl font-bold mb-2 text-center text-purple-300">MyJournal</h1>
      <p className="text-gray-500 text-center mb-6">Your safe space for reflection</p>

      {error && (
        <p className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-300 text-white p-3 rounded-lg hover:bg-purple-400"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </p>
    </div>

    <div className="mt-8 max-w-md text-center">
      <p className="text-gray-600 text-sm">
        Your mental health matters. Taking time to reflect on your thoughts and feelings 
        is a proven and important step toward self-awareness and well-being. MyJournal provides 
        a private space to express yourself and receive supportive insights.
      </p>
    </div>
  </div>
);

}