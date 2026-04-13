import { Link } from "react-router-dom"
import ScoreWidget from "../components/ScoreWidget"

const cards = [
  {
    to: "/quiz",
    icon: "?",
    title: "Team quiz",
    text: "Multiple-choice questions. Edit them in src/data/questions.js.",
    cta: "Start quiz",
  },
  {
    to: "/icebreakers",
    icon: "\u{1F4AC}",
    title: "Icebreaker prompts",
    text: "Random conversation starters - great for the first 10-15 minutes.",
    cta: "Draw a prompt",
  },
  {
    to: "/games/taboo",
    icon: "\u{1F4AC}",
    title: "Taboo-style guessing",
    text: "Describe the word without using forbidden words. 60s turns, alternating teams.",
    cta: "Play Taboo",
  },
  {
    to: "/games/categories",
    icon: "\u{1F4DC}",
    title: "Categories (60s)",
    text: "Get a random category + letter. Teams brainstorm fast; host awards points.",
    cta: "Play Categories",
  },
  {
    to: "/games/draw",
    icon: "\u{1F3A8}",
    title: "Draw & guess",
    text: "Whiteboard or emoji-only hints. Timed turns, great for big teams.",
    cta: "Play Draw & guess",
  },
  {
    to: "/games/truths-lies",
    icon: "\u{1F914}",
    title: "Two truths & a lie",
    text: "Three statements per round; teams spot the lie, host scores.",
    cta: "Play truths & lie",
  },
  {
    to: "/games/rapidfire",
    icon: "\u26A1",
    title: "Rapid-fire",
    text: "Quick questions; first team to answer wins the point (host taps +1).",
    cta: "Play rapid-fire",
  },
]

export default function Home() {
  return (
    <div className="home-page">
      <div className="bg-pattern" aria-hidden="true" />
      <header className="home-header">
        <div className="home-header-row">
          <h1 className="home-title">Fun Friday</h1>
          <div className="home-header-scores" aria-label="Live team scores">
            <ScoreWidget />
          </div>
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

      <footer className="site-footer site-footer--hub">
        <p>
          Dev: <code>npm run dev</code> · Build: <code>npm run build</code>
        </p>
      </footer>
    </div>
  )
}
