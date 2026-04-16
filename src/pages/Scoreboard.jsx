import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useScore } from "../context/ScoreContext";
import { FUN_FRIDAY_TEAM_ASSIGNMENTS } from "../data/team-assignments";
import StickyScoreBar from "../components/StickyScoreBar";

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

  return (
    <div className="scoreboard-page">
      <div className="bg-pattern" aria-hidden="true" />
      <StickyScoreBar />
      <header className="scoreboard-top-header scoreboard-top-header--compact">
        <div className="scoreboard-top-header-inner">
          <div className="scoreboard-top-brand">
            <Link className="scoreboard-top-back" to="/">
              ← Hub
            </Link>
            <div className="scoreboard-top-titles">
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
              </div>

              <div className="scorecard">
                <div className="field-label">Team B members</div>
                <ol className="scoreboard-roster">
                  {rosterB.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ol>
              </div>
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
