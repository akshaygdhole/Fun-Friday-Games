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
        <h1 className="landing-headline">Quick, fun rounds for your meeting</h1>
        <p className="landing-subhead">
          Pick a game, share your screen, and keep score live.
        </p>

        <div className="landing-actions">
          <Link className="landing-cta" to="/home">
            Enter games
          </Link>
          <Link className="landing-link" to="/scoreboard">
            Open scoreboard
          </Link>
        </div>
      </main>
    </div>
  )
}

