"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJournals, getWeeklyInsights } from "@/lib/api";
import AppLayout from "../components/AppLayout";

interface Journal {
  _id: string;
  title: string;
  mood: string;
  createdAt: string;
  analysis: string | null;
}

export default function JournalsPage() {
  const router = useRouter();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);

  const [insights, setInsights] = useState<string | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    getJournals(token).then((data) => {
      if (data.message) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        setJournals(data);
        setLoading(false);
      }
    });
  }, [router]);

  const getMoodEmoji = (mood: string) => {
    const moods: Record<string, string> = {
      great: "😄",
      good: "🙂",
      okay: "😐",
      bad: "😔",
      terrible: "😢",
    };
    return moods[mood] || "😐";
  };

  const handleGetInsights = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  setInsightsLoading(true);
  setInsightsError("");
  setInsights(null);

  const data = await getWeeklyInsights(token);

  if (data.insights) {
    setInsights(data.insights);
  } else {
    setInsightsError(data.message || "Failed to get insights");
  }
  setInsightsLoading(false);
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

return (
  <AppLayout>
    <div className="max-w-3xl">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <h1 className="text-2xl md:text-3xl font-bold">My Journals</h1>
      <div className="flex gap-2">
          <button
            onClick={handleGetInsights}
            disabled={insightsLoading}
            className="bg-purple-300 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
          >
            {insightsLoading ? "Analyzing..." : "Weekly Insights"}
          </button>
          <button
            onClick={() => router.push("/journals/new")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + New Entry
          </button>
        </div>
      </div>

      {insightsError && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">
          {insightsError}
        </div>
      )}

      {insights && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-green-800">Weekly Insights</h2>
            <button
              onClick={() => setInsights(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="whitespace-pre-wrap text-gray-700">{insights}</p>
        </div>
      )}

      {journals.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No journal entries yet.</p>
          <p className="text-gray-500 mt-2">Click &apos;New Entry&apos; to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {journals.map((journal) => (
            <div
              key={journal._id}
              onClick={() => router.push(`/journals/${journal._id}`)}
              className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{journal.title}</h2>
                <span className="text-2xl">{getMoodEmoji(journal.mood)}</span>
              </div>
              <p className="text-gray-500 mt-2">
                {new Date(journal.createdAt).toLocaleDateString()}
              </p>
              {journal.analysis && (
                <span className="text-green-600 text-sm mt-2 inline-block">
                  ✓ Analyzed
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </AppLayout>
);

}