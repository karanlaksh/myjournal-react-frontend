"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJournal } from "@/lib/api";
import Header from "../../components/Header";

export default function NewJournalPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("okay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const data = await createJournal({ title, content, mood }, token);

    if (data._id) {
      router.push(`/journals/${data._id}`);
    } else {
      setError(data.message || "Failed to create journal");
      setLoading(false);
    }
  };

  const moods = [
    { value: "great", emoji: "😄", label: "Great" },
    { value: "good", emoji: "🙂", label: "Good" },
    { value: "okay", emoji: "😐", label: "Okay" },
    { value: "bad", emoji: "😔", label: "Bad" },
    { value: "terrible", emoji: "😢", label: "Terrible" },
  ];

  return (
  <div className="min-h-screen bg-gray-100">
    <Header />
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push("/journals")}
          className="text-blue-500 hover:underline mb-6 inline-block"
        >
          ← Back to Journals
        </button>

        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6">New Journal Entry</h1>

          {error && (
            <p className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Give your entry a title..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">How are you feeling?</label>
              <div className="flex gap-2">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    className={`flex-1 p-3 rounded-lg border text-center transition ${
                      mood === m.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <p className="text-sm mt-1">{m.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">What&apos;s on your mind?</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
                placeholder="Write your thoughts here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Entry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

}