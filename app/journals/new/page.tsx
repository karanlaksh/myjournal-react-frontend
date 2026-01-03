"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createJournal } from "@/lib/api";
import AppLayout from "../../components/AppLayout";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognition(): SpeechRecognitionInstance | null {
  if (typeof window === "undefined") return null;
  const SpeechRecognitionAPI = (window as Window & { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition || (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
  if (SpeechRecognitionAPI) {
    return new SpeechRecognitionAPI();
  }
  return null;
}

export default function NewJournalPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("okay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  function startListening() {
    const recognition = getSpeechRecognition();
    if (!recognition) {
      alert("Speech recognition is not supported in your browser. Try Chrome or Safari.");
      return;
    }

    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = function(event: SpeechRecognitionEvent) {
      const lastIndex = event.results.length - 1;
      const transcript = event.results[lastIndex][0].transcript;
      setContent(function(prev) { return prev + " " + transcript; });
    };

    recognition.onerror = function() {
      setIsListening(false);
    };

    recognition.onend = function() {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  const handleSubmit = async function(e: React.FormEvent) {
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
      router.push("/journals/" + data._id);
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
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={function() { router.push("/journals"); }}
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
                onChange={function(e) { setTitle(e.target.value); }}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Give your entry a title..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">How are you feeling?</label>
              <div className="flex gap-2">
                {moods.map(function(m) {
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={function() { setMood(m.value); }}
                      className={`flex-1 p-3 rounded-lg border text-center transition ${mood === m.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <p className="text-sm mt-1">{m.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700">What&apos;s on your mind?</label>
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${isListening ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                  {isListening ? "🎤 Stop" : "🎤 Speak"}
                </button>
              </div>
              <textarea
                value={content}
                onChange={function(e) { setContent(e.target.value); }}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
                placeholder="Write your thoughts here or click Speak to use voice..."
                required
              />
              {isListening && (
                <p className="text-sm text-red-500 mt-1">Listening... Speak now</p>
              )}
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
    </AppLayout>
  );
}