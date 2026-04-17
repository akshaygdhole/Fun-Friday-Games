import { useEffect } from "react"
import { Link } from "react-router-dom"
import ScoreWidget from "../components/ScoreWidget"
import LivelyticsLogoIcon from "../assets/LivelyticsLogoIcon"
import FullscreenButton from "../components/FullscreenButton"

const cards = [
  {
    to: "/quiz",
    icon: "?",
    title: "Team quiz",
    text: "Team A gets 15 seconds to answer. If they can’t, Team B gets 15 seconds to steal.",
    cta: "Start quiz",
  },
  {
    to: "/games/scavenger-hunt",
    icon: "\u{1F3E0}",
    title: "Home Hunt",
    text: "Race to find an item and show it on camera (or in chat). Fastest wins the round.",
    cta: "Start Home Hunt",
  },
  {
    to: "/games/draw",
    icon: "🎨",
    title: "Draw & Guess",
    text: "The host will provide a word or phrase.\n⚡ Reply with the correct emojis—the fastest correct answer wins 🏆🔥",
    cta: "Start Draw & Guess",
  },
  {
    to: "/games/categories",
    icon: "\u{1F4DC}",
    title: "Letter Sprint (60s)",
    text: "Get a category + letter. You have 60 seconds to list as many matching answers as you can.",
    cta: "Play Letter Sprint",
  },
  {
    to: "/games/meme-caption",
    icon: "\u{1F5BC}\uFE0F",
    title: "Meme Caption Battle",
    text: "Write the funniest caption in 30 seconds. Vote the best—winner gets +1.",
    cta: "Play Meme Caption",
  },

  {
    to: "/games/truths-lies",
    icon: "\u{1F914}",
    title: "Two truths & a lie",
    text: "One person shares 3 statements. Everyone guesses which one is the lie.",
    cta: "Play truths & lie",
  },
  {
    to: "/games/rapidfire",
    icon: "\u26A1",
    title: "Rapid-fire",
    text: "Fast questions. Shout the answer—speed matters more than strategy.",
    cta: "Play rapid-fire",
  },

  {
    to: "/icebreakers",
    icon: "\u{1F4AC}",
    title: "Icebreaker prompts",
    text: "Random fun questions to warm up the room.",
    cta: "Draw a prompt",
  },
]

export default function Home() {
  useEffect(() => {
    document.title = "Livelytics Team Games"
  }, [])

  return (
    <div className="home-page">
      <div className="bg-pattern" aria-hidden="true" />
      <header className="home-header">
        <div className="home-header-bar">
          <div className="home-brand" aria-label="Livelytics Play Team Games">
            <div className="home-brand-mark">
              <LivelyticsLogoIcon width="132" height="31" />
            </div>
            <h1 className="home-title">
              <span className="home-brand-play">Play</span>
              <span className="home-title-text">Team Games</span>
            </h1>
          </div>
          <div className="home-header-actions">
            <div className="home-header-scores" aria-label="Live team scores">
              <ScoreWidget />
            </div>
            <FullscreenButton className="home-fullscreen-btn" />
          </div>
        </div>
        <div className="home-header-lede">
          <p className="home-subtitle">
            Pick a game and play a quick round with your team.
          </p>
          <p className="home-powered-line">Powered by Livelytics</p>
        </div>
      </header>

      <main className="cards cards--hub">
        {cards.map((c) => (
          <Link key={c.to} className="card" to={c.to}>
            <span className="card-icon" aria-hidden="true">
              {c.icon}
            </span>
            <h2>{c.title}</h2>
            <p>{c.text}</p>
            <span className="card-cta">{c.cta}</span>
          </Link>
        ))}
      </main>

      <footer className="site-footer site-footer--hub" />
    </div>
  )
}
