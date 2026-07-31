import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import ScoreWidget from "../components/ScoreWidget"
import LivelyticsLogoIcon from "../assets/LivelyticsLogoIcon"
import FullscreenButton from "../components/FullscreenButton"

const cards = [
  // {
  //   to: "/quiz",
  //   icon: "?",
  //   title: "Team quiz",
  //   text: "Team A gets 15 seconds to answer. If they can’t, Team B gets 15 seconds to steal.",
  //   cta: "Start quiz",
  // },
  // {
  //   to: "/games/draw",
  //   icon: "🎨",
  //   title: "Draw & Guess",
  //   text: "The host will provide a word or phrase.\n⚡ Reply with the correct emojis—the fastest correct answer wins 🏆🔥",
  //   cta: "Start Draw & Guess",
  // },
  {
    to: "/games/categories",
    icon: "\u{1F4DC}",
    title: "Letter Sprint (60s)",
    text: "Get a category + letter. You have 60 seconds to list as many matching answers as you can.",
    cta: "Play Letter Sprint",
    seal: "01",
    sealTitle: "Mystery game",
    sealHint: "Keep it mystery until you’re ready",
  },
  {
    to: "/games/meme-caption",
    icon: "\u{1F5BC}\uFE0F",
    title: "Meme Caption Battle",
    text: "Write the funniest caption in 30 seconds. Vote the best—winner gets +1.",
    cta: "Play Meme Caption",
    seal: "02",
    sealTitle: "Mystery game",
    sealHint: "Nobody peeks",
  },
  {
    to: "/games/scavenger-hunt",
    icon: "\u{1F3E0}",
    title: "Home Hunt",
    text: "Race to find an item and show it on camera (or in chat). Fastest wins the round.",
    cta: "Start Home Hunt",
    seal: "03",
    sealTitle: "Mystery game",
    sealHint: "Cameras ready… later",
  },
  // {
  //   to: "/games/truths-lies",
  //   icon: "\u{1F914}",
  //   title: "Two truths & a lie",
  //   text: "One person shares 3 statements. Everyone guesses which one is the lie.",
  //   cta: "Play truths & lie",
  // },
  // {
  //   to: "/games/rapidfire",
  //   icon: "\u26A1",
  //   title: "Rapid-fire",
  //   text: "Fast questions. Shout the answer—speed matters more than strategy.",
  //   cta: "Play rapid-fire",
  // },
  {
    to: "/icebreakers",
    icon: "\u{1F4AC}",
    title: "Icebreaker prompts",
    text: "Random fun questions to warm up the room.",
    cta: "Draw a prompt",
    seal: "04",
    sealTitle: "Mystery game",
    sealHint: "Warm-up energy, still secret",
  },
  {
    to: "/games/desklympics",
    icon: "\u{1F3C6}",
    title: "Desklympics",
    text: "Cameras on for silly desk stunts. Fastest finish or funniest take wins the event.",
    cta: "Play Desklympics",
    seal: "★",
    sealTitle: "Final surprise",
    sealHint: "Save this one for last",
    finale: true,
  },
]

function SealedGameCard({ card, revealed, onReveal }) {
  if (!revealed) {
    return (
      <button
        type="button"
        className={`card card--sealed${card.finale ? " card--sealed-finale" : ""}`}
        onClick={onReveal}
        aria-label={`Reveal ${card.sealTitle} ${card.seal}`}
      >
        <span className="card-seal-mark" aria-hidden="true">
          {card.seal}
        </span>
        <h2>{card.sealTitle}</h2>
        <p>{card.sealHint}</p>
        <span className="card-cta">Reveal game</span>
      </button>
    )
  }

  return (
    <Link className="card card--revealed" to={card.to}>
      <span className="card-icon" aria-hidden="true">
        {card.icon}
      </span>
      <h2>{card.title}</h2>
      <p>{card.text}</p>
      <span className="card-cta">{card.cta}</span>
    </Link>
  )
}

export default function Home() {
  const [revealedByPath, setRevealedByPath] = useState({})

  useEffect(() => {
    document.title = "Livelytics Team Games"
  }, [])

  const sealedLeft = useMemo(
    () => cards.filter((c) => !revealedByPath[c.to]).length,
    [revealedByPath],
  )

  const revealGame = (path) => {
    setRevealedByPath((prev) => ({ ...prev, [path]: true }))
  }

  const revealNext = () => {
    const next = cards.find((c) => !revealedByPath[c.to])
    if (next) revealGame(next.to)
  }

  const sealAll = () => setRevealedByPath({})

  return (
    <div className="home-page">
      <div className="bg-pattern" aria-hidden="true" />
      <header className="home-header">
        <div className="home-header-bar">
          <Link to="/" className="home-brand" aria-label="Go to landing page">
            <div className="home-brand-mark">
              <LivelyticsLogoIcon width="132" height="31" />
            </div>
            <h1 className="home-title">
              <span className="home-brand-play">Play</span>
              <span className="home-title-text">Team Games</span>
            </h1>
          </Link>
          <div className="home-header-actions">
            <div className="home-header-scores" aria-label="Live team scores">
              <ScoreWidget />
            </div>
            <FullscreenButton className="home-fullscreen-btn" variant="icon" />
          </div>
        </div>
        <div className="home-header-lede">
          <p className="home-subtitle">
            Games stay sealed until you reveal them — keep the room guessing.
          </p>
          <p className="home-powered-line">Powered by Livelytics</p>
          <div className="home-seal-actions">
            <button
              type="button"
              className="btn btn-primary home-seal-btn"
              onClick={revealNext}
              disabled={sealedLeft === 0}
            >
              Reveal next
            </button>
            <button
              type="button"
              className="btn btn-ghost home-seal-btn"
              onClick={sealAll}
              disabled={sealedLeft === cards.length}
            >
              Seal all again
            </button>
          </div>
        </div>
      </header>

      <main className="cards cards--hub">
        {cards.map((c) => (
          <SealedGameCard
            key={c.to}
            card={c}
            revealed={Boolean(revealedByPath[c.to])}
            onReveal={() => revealGame(c.to)}
          />
        ))}
      </main>

      <footer className="site-footer site-footer--hub" />
    </div>
  )
}
