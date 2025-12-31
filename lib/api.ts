const API_URL = "http://localhost:4000/api";

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getJournals(token: string) {
  const res = await fetch(`${API_URL}/journals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getJournal(id: string, token: string) {
  const res = await fetch(`${API_URL}/journals/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createJournal(
  data: { title: string; content: string; mood: string },
  token: string
) {
  const res = await fetch(`${API_URL}/journals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function analyzeJournal(id: string, token: string) {
  const res = await fetch(`${API_URL}/journals/${id}/analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function deleteJournal(id: string, token: string) {
  const res = await fetch(`${API_URL}/journals/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getWeeklyInsights(token: string) {
  const res = await fetch(`${API_URL}/journals/insights`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}