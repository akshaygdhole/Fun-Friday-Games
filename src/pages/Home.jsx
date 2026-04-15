import { Link } from "react-router-dom"
import ScoreWidget from "../components/ScoreWidget"

const cards = [
  {
    to: "/quiz",
    icon: "?",
    title: "Team quiz",
    text: "Team B gets 15s, then Team A gets 15s. After that, anyone can answer—tap Reveal to check.",
    cta: "Start quiz",
  },
  {
    to: "/games/scavenger-hunt",
    icon: "\u{1F3E0}",
    title: "Virtual scavenger hunt",
    text: "Race to find an item and show it on camera (or in chat). Fastest wins the round.",
    cta: "Start scavenger hunt",
  },
  {
    to: "/games/draw",
    icon: "\u{1F3A8}",
    title: "Draw & guess",
    text: "One person draws (or gives emoji-only hints). Everyone guesses—no speaking, just clues—before the timer ends.",
    cta: "Play Draw & guess",
  },
  {
    to: "/games/categories",
    icon: "\u{1F4DC}",
    title: "Letter Sprint (60s)",
    text: "Get a category + letter. You have 60 seconds to list as many matching answers as you can.",
    cta: "Play Letter Sprint",
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
        <p className="home-subtitle">
          Pick a game and play a quick round with your team.
        </p>
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
