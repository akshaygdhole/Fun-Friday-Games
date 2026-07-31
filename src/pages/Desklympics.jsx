import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useScore } from "../context/ScoreContext"
import { FUN_FRIDAY_DESKLYMPICS } from "../data/desklympics"
import { shuffle } from "../utils/shuffle"

const ROUND_SECONDS = 30

export default function Desklympics() {
  const items = FUN_FRIDAY_DESKLYMPICS || []
  const { addScore } = useScore()
  const deckRef = useRef([])
  const lastRef = useRef(null)

  const [current, setCurrent] = useState(null)
  const [remaining, setRemaining] = useState(ROUND_SECONDS)
  const [running, setRunning] = useState(false)
  const [itemNum, setItemNum] = useState(0)

  useEffect(() => {
    document.title = "Livelytics Team Games · Desklympics"
  }, [])

  const newRound = useCallback(() => {
    if (!items.length) return

    if (!deckRef.current.length) {
      let nextDeck = shuffle([...items])
      if (items.length > 1 && lastRef.current != null) {
        let guard = 0
        while (nextDeck[0] === lastRef.current && guard++ < 32) {
          nextDeck = shuffle([...items])
        }
      }
      deckRef.current = nextDeck
      setItemNum(0)
    }

    const next = deckRef.current.shift() ?? null
    lastRef.current = next
    setCurrent(next)
    setRunning(false)
    setRemaining(ROUND_SECONDS)
    setItemNum((n) => n + 1)
  }, [items])

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false)
          return ROUND_SECONDS
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
          <Link to="/home">← Back to hub</Link>
        </nav>
        <header className="activity-hero--split">
          <h1 className="page-title">Desklympics</h1>
          <p className="page-sub">
            Cameras on. Complete the stunt — fastest finish or funniest take
            wins the round.
          </p>
        </header>
        <section className="panel activity-panel">
          <div className="quiz-meta">
            <span>
              Timer: {remaining}s {!running ? "(paused)" : ""}
            </span>
            <span>
              {items.length
                ? `Event ${Math.min(itemNum, items.length)} / ${items.length}`
                : "No events"}
            </span>
          </div>

          <p className="scavenger-hunt-instruction">
            Your event:
          </p>
          <div
            className={`prompt-box scavenger-hunt-object ${current ? "" : "placeholder"}`}
          >
            {empty
              ? "No events yet — add a few and try again."
              : (current ?? "Tap “Next event” for a stunt.")}
          </div>

          <div className="activity-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={newRound}
              disabled={empty}
            >
              Next event
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setRunning(true)}
              disabled={running || empty}
            >
              Start {ROUND_SECONDS}s
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
              onClick={() => addScore(0, 1)}
            >
              Team A wins event (+1)
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addScore(1, 1)}
            >
              Team B wins event (+1)
            </button>
          </div>

          <p className="activity-tip" />
        </section>
      </main>
    </div>
  )
}
