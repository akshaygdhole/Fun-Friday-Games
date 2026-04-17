import { useEffect } from "react"
import { Link } from "react-router-dom"
import LivelyticsLogoIcon from "../assets/LivelyticsLogoIcon"
import heroImage from "../assets/images/herobackgroundBanner.png"
import FullscreenButton from "../components/FullscreenButton"

export default function Landing() {
  useEffect(() => {
    document.title = "Livelytics Team Games"
  }, [])

  return (
    <div className="landing-page">
      <div className="landing-hero" aria-hidden="true">
        <img className="landing-hero-img" src={heroImage} alt="" />
        <div className="landing-hero-scrim" />
      </div>

      <header className="landing-header">
        <div className="landing-brand" aria-label="Livelytics Play Team Games">
          <div className="landing-brand-mark" aria-hidden="true">
            <LivelyticsLogoIcon width="160" height="38" />
          </div>
          <div className="landing-brand-title">
            <span className="landing-brand-play">Play</span>
            <span className="landing-brand-name">Team Games</span>
          </div>
        </div>
        <div className="landing-header-actions">
          <FullscreenButton className="landing-fullscreen-btn" variant="icon" />
        </div>
      </header>

      <main className="landing-main">
        <h1 className="landing-headline">Quick games. Big energy.</h1>
        <p className="landing-subhead">
          Jump in, play along, and keep it fun — no prep needed.
        </p>

        <div className="landing-actions">
          <Link className="landing-cta" to="/home">
            Enter games
          </Link>
          <Link className="landing-link" to="/scoreboard">
            Open scoreboard
          </Link>
        </div>

        <div className="landing-quickready" aria-label="Quick ready checklist">
          <span className="landing-quickready-label">Quick ready</span>
          <div className="landing-quickready-chips" role="list">
            <span className="landing-quickready-chip" role="listitem">
              🙌 Be present — join in fully
            </span>
            <span className="landing-quickready-chip" role="listitem">
              👀 Faces help — camera on if you can
            </span>
            <span className="landing-quickready-chip" role="listitem">
              😄 Reactions welcome
            </span>
            <span className="landing-quickready-chip" role="listitem">
              🌐 Stable internet if you can
            </span>

            <span className="landing-quickready-chip" role="listitem">
              🏆 Winner picks next game
            </span>
            <span className="landing-quickready-chip" role="listitem">
              😂 Funniest wrong answer gets respect
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
