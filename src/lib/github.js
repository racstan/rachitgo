export async function fetchContributions({ signal, username } = {}) {
  const params = username ? `?username=${encodeURIComponent(username)}` : "";
  const response = await fetch(`/api/github${params}`, { signal });
  if (!response.ok) {
    throw new Error("GitHub snapshot unavailable.");
  }
  const data = await response.json();
  if (!data?.calendar) {
    throw new Error(data?.error || "GitHub snapshot missing.");
  }
  return {
    calendar: data.calendar,
    repos: Array.isArray(data.repos) ? data.repos : [],
  };
}
