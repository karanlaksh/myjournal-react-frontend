"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

function getUserName() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user).name;
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return function() {
    window.removeEventListener("storage", callback);
  };
}

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const userName = useSyncExternalStore(subscribe, getUserName, function() { return null; });

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <header className="bg-white shadow">
      <div className="px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="md:hidden text-gray-600 text-2xl">☰</button>
          <h1 onClick={function() { router.push("/journals"); }} className="text-xl font-bold text-purple-300 cursor-pointer">MyJournal</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-gray-600 text-sm md:text-base">{userName ? "Hi, " + userName : ""}</span>
          <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800 text-sm md:text-base">Logout</button>
        </div>
      </div>
    </header>
  );
}