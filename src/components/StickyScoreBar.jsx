import { Link, useLocation } from "react-router-dom"
import { useScore } from "../context/ScoreContext"

/**
 * Sticky bar on all activity routes: always-visible scores + quick adjust + link to full scoreboard.
 * Hidden on /scoreboard (that page is the full editor) and on / (home has its own header scores).
 */
export default function StickyScoreBar() {
  const { pathname } = useLocation()
  const { teams, addScore } = useScore()
  const [a, b] = teams

  if (pathname === "/scoreboard") return null

  return (
    <header
      className="sticky-score-bar"
      role="region"
      aria-label="Live scores — quick adjust"
    >
      <div className="sticky-score-bar-inner">
        <div className="sticky-score-bar-brand">
          <span className="sticky-score-bar-title">Live scores</span>
          <span className="sticky-score-bar-hint">Quick + / −</span>
        </div>

        <div className="sticky-score-bar-teams">
          <div className="sticky-score-team">
            <div className="sticky-score-team-row">
              <span className="sticky-score-team-name" title={a.name}>
                {a.name}
              </span>
              <span className="sticky-score-team-num">{a.score}</span>
            </div>
            <div className="sticky-score-quick">
              <button
                type="button"
                className="sticky-score-btn sticky-score-btn-plus"
                onClick={() => addScore(0, 1)}
                title={`${a.name}: +1`}
                aria-label={`${a.name} plus one`}
              >
                +1
              </button>
              <button
                type="button"
                className="sticky-score-btn sticky-score-btn-minus"
                onClick={() => addScore(0, -1)}
                title={`${a.name}: foul`}
                aria-label={`${a.name} minus one`}
              >
                −1
              </button>
            </div>
          </div>

          <span className="sticky-score-vs" aria-hidden="true">
            vs
          </span>

          <div className="sticky-score-team">
            <div className="sticky-score-team-row">
              <span className="sticky-score-team-name" title={b.name}>
                {b.name}
              </span>
              <span className="sticky-score-team-num">{b.score}</span>
            </div>
            <div className="sticky-score-quick">
              <button
                type="button"
                className="sticky-score-btn sticky-score-btn-plus"
                onClick={() => addScore(1, 1)}
                title={`${b.name}: +1`}
                aria-label={`${b.name} plus one`}
              >
                +1
              </button>
              <button
                type="button"
                className="sticky-score-btn sticky-score-btn-minus"
                onClick={() => addScore(1, -1)}
                title={`${b.name}: foul`}
                aria-label={`${b.name} minus one`}
              >
                −1
              </button>
            </div>
          </div>
        </div>

        <div className="sticky-score-bar-actions">
          <Link
            to="/scoreboard"
            className="sticky-score-link sticky-score-link-primary"
          >
            Scoreboard
          </Link>
          <Link to="/" className="sticky-score-link">
            Hub
          </Link>
        </div>
      </div>
    </header>
  )
}
