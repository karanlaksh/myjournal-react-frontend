"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getJournal, analyzeJournal, deleteJournal } from "@/lib/api";
import Header from "../../components/Header";

interface Journal {
  _id: string;
  title: string;
  content: string;
  mood: string;
  analysis: string | null;
  createdAt: string;
}

export default function JournalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    getJournal(params.id as string, token).then((data) => {
      if (data.message) {
        router.push("/journals");
      } else {
        setJournal(data);
        setLoading(false);
      }
    });
  }, [params.id, router]);

  const handleAnalyze = async () => {
    const token = localStorage.getItem("token");
    if (!token || !journal) return;

    setAnalyzing(true);
    const data = await analyzeJournal(journal._id, token);
    if (data.analysis) {
      setJournal(data);
    }
    setAnalyzing(false);
  };

  const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this entry?")) return;
  
  const token = localStorage.getItem("token");
  if (!token || !journal) return;

  await deleteJournal(journal._id, token);
  router.push("/journals");
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!journal) return null;

  return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="p-8">
              <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/journals")}
            className="text-blue-500 hover:underline"
          >
            ← Back to Journals
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
          >
            Delete Entry
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{journal.title}</h1>
            <span className="text-3xl">{getMoodEmoji(journal.mood)}</span>
          </div>

          <p className="text-gray-500 mb-6">
            {new Date(journal.createdAt).toLocaleDateString()}
          </p>

          <div className="prose max-w-none mb-8">
            <p className="whitespace-pre-wrap">{journal.content}</p>
          </div>

          <hr className="my-8" />

          <div>
            <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>

            {journal.analysis ? (
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="whitespace-pre-wrap">{journal.analysis}</p>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-4">
                  Get supportive feedback on your journal entry.
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                >
                  {analyzing ? "Analyzing..." : "Analyze Entry"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}