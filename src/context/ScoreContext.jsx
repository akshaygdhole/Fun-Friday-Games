import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "fun_friday_score_v1";

const defaultTeams = () => [
  { name: "Team A", score: 0 },
  { name: "Team B", score: 0 },
];

function loadTeams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTeams();
    const state = JSON.parse(raw);
    if (
      state &&
      Array.isArray(state.teams) &&
      state.teams.length === 2 &&
      typeof state.teams[0]?.score === "number" &&
      typeof state.teams[1]?.score === "number"
    ) {
      return state.teams;
    }
  } catch {
    /* ignore */
  }
  return defaultTeams();
}

function saveAndNotify(nextTeams) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ teams: nextTeams }));
  window.dispatchEvent(
    new CustomEvent("fun-friday-score-updated", { detail: { teams: nextTeams } })
  );
}

const ScoreContext = createContext(null);

export function ScoreProvider({ children }) {
  const [teams, setTeams] = useState(loadTeams);

  const setTeamName = useCallback((teamIndex, name) => {
    setTeams((prev) => {
      const n = String(name || "").trim() || (teamIndex === 0 ? "Team A" : "Team B");
      const next = prev.map((t, i) => (i === teamIndex ? { ...t, name: n } : t));
      saveAndNotify(next);
      return next;
    });
  }, []);

  const addScore = useCallback((teamIndex, delta) => {
    setTeams((prev) => {
      const next = prev.map((t, i) =>
        i === teamIndex ? { ...t, score: Math.max(0, (t.score || 0) + delta) } : t
      );
      saveAndNotify(next);
      return next;
    });
  }, []);

  const resetScores = useCallback(() => {
    setTeams((prev) => {
      const next = prev.map((t) => ({ ...t, score: 0 }));
      saveAndNotify(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const sync = () => setTeams(loadTeams());
    window.addEventListener("storage", sync);
    window.addEventListener("fun-friday-score-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("fun-friday-score-updated", sync);
    };
  }, []);

  const value = { teams, setTeamName, addScore, resetScores };
  return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>;
}

export function useScore() {
  const ctx = useContext(ScoreContext);
  if (!ctx) throw new Error("useScore must be used within ScoreProvider");
  return ctx;
}
