import { Link, useLocation } from "react-router-dom"
import { useScore } from "../context/ScoreContext"
import LivelyticsLogoIcon from "../assets/LivelyticsLogoIcon"
import FullscreenButton from "./FullscreenButton"

/**
 * Sticky bar on all activity routes: always-visible scores + quick adjust + link to full scoreboard.
 * Hidden on /scoreboard (that page is the full editor) and on / (home has its own header scores).
 */
export default function StickyScoreBar() {
  const { pathname } = useLocation()
  const { teams, addScore } = useScore()
  const [a, b] = teams

  return (
    <header
      className="sticky-score-bar"
      role="region"
      aria-label="Live scores — quick adjust"
    >
      <div className="sticky-score-bar-inner">
        <div className="sticky-score-bar-brand">
          <div className="sticky-score-bar-logo-stack" aria-label="Livelytics Team Games">
            <Link
              to="/"
              className="sticky-score-bar-logo-link"
              aria-label="Go to landing page"
            >
              <span className="sticky-score-bar-logo-graphic" aria-hidden="true">
                <LivelyticsLogoIcon width="132" height="31" />
              </span>
            </Link>
            <Link
              to="/home"
              className="sticky-score-bar-titles-link"
              aria-label="Go to game hub"
            >
              <span className="sticky-score-bar-brand-titles">
                <span className="sticky-score-bar-play">Play</span>
                <span className="sticky-score-bar-brand-name">Team Games</span>
              </span>
            </Link>
          </div>
        </div>

        {pathname !== "/scoreboard" ? (
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
        ) : (
          <div className="sticky-score-bar-spacer" aria-hidden="true" />
        )}

        <div className="sticky-score-bar-actions">
          <FullscreenButton className="sticky-fullscreen-btn" variant="icon" />
          <Link
            to="/scoreboard"
            className="sticky-score-link sticky-score-link-primary"
          >
            Scoreboard
          </Link>
        </div>
      </div>
    </header>
  )
}
