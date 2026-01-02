"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [quote, setQuote] = useState<{ q: string; a: string } | null>(null);

  useEffect(function() {
    fetch("https://zenquotes.io/api/today")
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data[0]) {
          setQuote({ q: data[0].q, a: data[0].a });
        }
      })
      .catch(function() {
        setQuote({ q: "Every day is a fresh start.", a: "Unknown" });
      });
  }, []);

  const navItems = [
    { name: "Journals", path: "/journals", icon: "📓" },
    { name: "Resources", path: "/resources", icon: "🆘" },
  ];

  function handleNavClick(path: string) {
    router.push(path);
    onClose();
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-md min-h-screen p-4 flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <nav className="space-y-2">
          {navItems.map(function(item) {
            return (
              <button
                key={item.path}
                onClick={function() { handleNavClick(item.path); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${pathname.startsWith(item.path) ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t">
          <p className="text-xs text-gray-400 mb-2">Quote of the Day</p>
          {quote ? (
            <div className="text-sm">
              <p className="text-gray-600 italic">&quot;{quote.q}&quot;</p>
              <p className="text-gray-500 mt-1">— {quote.a}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Loading...</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            <a href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer" className="hover:underline">ZenQuotes.io</a>
          </p>
        </div>
      </aside>
    </>
  );
}