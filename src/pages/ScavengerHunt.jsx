import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useScore } from "../context/ScoreContext"
import { FUN_FRIDAY_SCAVENGER_HUNT } from "../data/scavenger-hunt"
import { shuffle } from "../utils/shuffle"

export default function ScavengerHunt() {
  const items = FUN_FRIDAY_SCAVENGER_HUNT || []
  const { addScore } = useScore()
  const deckRef = useRef([])

  const [current, setCurrent] = useState(null)
  const [remaining, setRemaining] = useState(60)
  const [running, setRunning] = useState(false)

  const newRound = useCallback(() => {
    if (!items.length) return
    if (!deckRef.current.length) deckRef.current = shuffle([...items])
    const next = deckRef.current.shift() ?? null
    setCurrent(next)
    setRunning(false)
    setRemaining(60)
  }, [items])

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false)
          return 60
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  const empty = !items.length

  return (
    <div className="activity-page">
      <div className="bg-pattern" aria-hidden="true" />
      <main className="activity-layout">
        <nav className="page-nav page-nav--activity">
          <Link to="/">← Back to hub</Link>
        </nav>
        <header className="activity-hero--split">
          <h1 className="page-title">Virtual scavenger hunt</h1>
          <p className="page-sub">
            Find the item, show it on camera or in chat. First team to show it
            earns <strong>2 points</strong>.
          </p>
        </header>
        <section className="panel activity-panel">
          <div className="quiz-meta">
            <span>
              Timer: {remaining}s {!running ? "(paused)" : ""}
            </span>
          </div>

          <p className="scavenger-hunt-instruction">
            Find and show on video or in chat:
          </p>
          <div
            className={`prompt-box scavenger-hunt-object ${current ? "" : "placeholder"}`}
          >
            {empty
              ? "Add items to src/data/scavenger-hunt.js"
              : (current ?? "Tap “Next item” for a random prompt.")}
          </div>

          <div className="activity-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={newRound}
              disabled={empty}
            >
              Next item
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setRunning(true)}
              disabled={running || empty}
            >
              Start 60s
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setRunning(false)}
              disabled={!running}
            >
              Stop timer
            </button>
          </div>

          <div className="activity-actions activity-actions--spaced activity-actions--grid">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addScore(0, 2)}
            >
              Team A showed it first (+2)
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addScore(1, 2)}
            >
              Team B showed it first (+2)
            </button>
          </div>

          <p className="activity-tip">
            Prompts: <code>src/data/scavenger-hunt.js</code>
          </p>
        </section>
      </main>
    </div>
  )
}
