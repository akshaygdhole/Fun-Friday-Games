import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useScore } from "../context/ScoreContext";
import { FUN_FRIDAY_TEAM_ASSIGNMENTS } from "../data/team-assignments";
import { shuffle } from "../utils/shuffle";

const ASSIGNMENTS_STORAGE_KEY = "fun_friday_team_assignments_v1";

function loadAssignmentsState() {
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    if (!state || typeof state !== "object") return null;
    return state;
  } catch {
    return null;
  }
}

function saveAssignmentsState(state) {
  localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(state));
}

export default function Scoreboard() {
  const { teams, setTeamName, addScore, resetScores } = useScore();
  const [t0, t1] = teams;
  const total = t0.score + t1.score;
  let leadLabel = "Tied";
  let leadClass = "scoreboard-stat-lead--tie";
  if (t0.score > t1.score) {
    leadLabel = t0.name;
    leadClass = "scoreboard-stat-lead--a";
  } else if (t1.score > t0.score) {
    leadLabel = t1.name;
    leadClass = "scoreboard-stat-lead--b";
  }

  useEffect(() => {
    document.title = "Livelytics Team Games · Scoreboard"
  }, [])

  const rosterA = useMemo(
    () => FUN_FRIDAY_TEAM_ASSIGNMENTS?.teamA || [],
    [],
  )
  const rosterB = useMemo(
    () => FUN_FRIDAY_TEAM_ASSIGNMENTS?.teamB || [],
    [],
  )

  const [pickerA, setPickerA] = useState({ deck: [], last: null })
  const [pickerB, setPickerB] = useState({ deck: [], last: null })

  // Load persisted picker state once.
  useEffect(() => {
    const saved = loadAssignmentsState()
    if (!saved) return
    if (saved?.pickerA) setPickerA(saved.pickerA)
    if (saved?.pickerB) setPickerB(saved.pickerB)
  }, [])

  // Persist on change.
  useEffect(() => {
    saveAssignmentsState({ pickerA, pickerB })
  }, [pickerA, pickerB])

  const pickNext = useCallback((team) => {
    const roster = team === "A" ? rosterA : rosterB
    if (!roster.length) return

    const setPicker = team === "A" ? setPickerA : setPickerB
    setPicker((prev) => {
      let deck = Array.isArray(prev?.deck) ? [...prev.deck] : []
      if (!deck.length) {
        deck = shuffle(roster.map((_, i) => i))
      }
      const nextIdx = deck.shift()
      const nextName = roster[nextIdx] ?? null
      return { deck, last: nextName }
    })
  }, [rosterA, rosterB])

  const resetPickers = useCallback(() => {
    setPickerA({ deck: [], last: null })
    setPickerB({ deck: [], last: null })
  }, [])

  return (
    <div className="scoreboard-page">
      <div className="bg-pattern" aria-hidden="true" />
      <header className="scoreboard-top-header">
        <div className="scoreboard-top-header-inner">
          <div className="scoreboard-top-brand">
            <Link className="scoreboard-top-back" to="/">
              ← Hub
            </Link>
            <div className="scoreboard-top-titles">
              <span className="scoreboard-top-eyebrow">Livelytics Team Games</span>
              <span className="scoreboard-top-title">Live scoreboard</span>
            </div>
          </div>
          <div className="scoreboard-top-stats" aria-live="polite" aria-label="Current scores">
            <div className="scoreboard-stat-pill">
              <span className="scoreboard-stat-name">{t0.name}</span>
              <span className="scoreboard-stat-num">{t0.score}</span>
            </div>
            <span className="scoreboard-stat-vs">vs</span>
            <div className="scoreboard-stat-pill">
              <span className="scoreboard-stat-name">{t1.name}</span>
              <span className="scoreboard-stat-num">{t1.score}</span>
            </div>
            <div className="scoreboard-stat-meta">
              <span className="scoreboard-stat-total">Total {total} pts</span>
              <span className={`scoreboard-stat-lead ${leadClass}`}>Leader: {leadLabel}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="page-main scoreboard-main">
        <h1 className="page-title scoreboard-page-title">Score controls</h1>
        <p className="page-sub">Rename teams, adjust scores (+1 / −1 / +5), or reset both to zero.</p>

        <div className="scoreboard-panels">
          <section className="panel">
            <h2 className="panel-title">Team assignments</h2>
            <div className="scoreboard scoreboard--rosters" aria-label="Team rosters">
              <div className="scorecard">
                <div className="field-label">Team A members</div>
                <ol className="scoreboard-roster">
                  {rosterA.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ol>

                <div className="scoreboard-tools">
                  <div className="scoreboard-tool-row">
                    <span className="scoreboard-tool-label">Pick next (random)</span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => pickNext("A")}
                    >
                      Pick
                    </button>
                  </div>
                  {pickerA.last ? (
                    <div className="scoreboard-tool-result">Next: {pickerA.last}</div>
                  ) : null}
                </div>
              </div>

              <div className="scorecard">
                <div className="field-label">Team B members</div>
                <ol className="scoreboard-roster">
                  {rosterB.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ol>

                <div className="scoreboard-tools">
                  <div className="scoreboard-tool-row">
                    <span className="scoreboard-tool-label">Pick next (random)</span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => pickNext("B")}
                    >
                      Pick
                    </button>
                  </div>
                  {pickerB.last ? (
                    <div className="scoreboard-tool-result">Next: {pickerB.last}</div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="scoreboard-actions">
              <button type="button" className="btn btn-ghost" onClick={resetPickers}>
                Reset random picks
              </button>
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-title">Score controls</h2>
            <div className="scoreboard" aria-label="Team scoreboard">
              {teams.map((t, idx) => (
                <div key={idx} className="scorecard">
                  <label className="field-label" htmlFor={`team-${idx}-name`}>
                    Team name
                  </label>
                  <input
                    className="text-input"
                    id={`team-${idx}-name`}
                    value={t.name}
                    onChange={(e) => setTeamName(idx, e.target.value)}
                  />
                  <div className="big-score" aria-label="Score">
                    {t.score}
                  </div>
                  <div className="score-buttons" aria-label="Score controls">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => addScore(idx, 1)}
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => addScore(idx, -1)}
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => addScore(idx, 5)}
                    >
                      +5
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="scoreboard-actions">
              <button type="button" className="btn btn-ghost" onClick={resetScores}>
                Reset scores
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
