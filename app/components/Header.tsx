"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const getUserName = () => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    if (!user) return null;
    try {
      return JSON.parse(user).name;
    } catch {
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const userName = getUserName();

  return (
    <header className="bg-white shadow">
      <div className="max-w-3xl mx-auto px-8 py-4 flex justify-between items-center">
        <h1
          onClick={() => router.push("/journals")}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          MindJournal
        </h1>
        <div className="flex items-center gap-4">
          {userName && <span className="text-gray-600">Hi, {userName}</span>}
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}