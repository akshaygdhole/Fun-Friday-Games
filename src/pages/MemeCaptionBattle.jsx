import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useScore } from "../context/ScoreContext"
import { FUN_FRIDAY_MEME_CAPTIONS } from "../data/meme-captions"
import { shuffle } from "../utils/shuffle"

const ROUND_SECONDS = 30

export default function MemeCaptionBattle() {
  const prompts = FUN_FRIDAY_MEME_CAPTIONS || []
  const { addScore } = useScore()
  const deckRef = useRef([])

  const [current, setCurrent] = useState(null)
  const [remaining, setRemaining] = useState(ROUND_SECONDS)
  const [running, setRunning] = useState(false)
  const [qNum, setQNum] = useState(0)

  useEffect(() => {
    document.title = "Livelytics Team Games · Meme Caption Battle"
  }, [])

  const nextPrompt = useCallback(() => {
    if (!deckRef.current.length) {
      deckRef.current = shuffle([...prompts])
      setQNum(0)
    }
    const p = deckRef.current.shift() ?? null
    setCurrent(p)
    setRunning(false)
    setRemaining(ROUND_SECONDS)
    setQNum((n) => n + 1)
  }, [prompts])

  useEffect(() => {
    if (current == null && prompts.length) nextPrompt()
  }, [current, prompts.length, nextPrompt])

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

  const total = prompts.length

  return (
    <div className="activity-page">
      <div className="bg-pattern" aria-hidden="true" />
      <main className="activity-layout">
        <nav className="page-nav page-nav--activity">
          <Link to="/">← Back to hub</Link>
        </nav>
        <header className="activity-hero--split">
          <h1 className="page-title">Meme Caption Battle</h1>
          <p className="page-sub">
            Read the prompt. Each team writes one funny caption in 30 seconds.
            Vote the best—winning team gets +1.
          </p>
        </header>
        <section className="panel activity-panel">
          <div className="quiz-meta">
            <span>Timer: {remaining}s {!running ? "(paused)" : ""}</span>
            <span>
              {total ? `Prompt ${Math.min(qNum, total)} / ${total}` : "No prompts"}
            </span>
          </div>

          <div className="prompt-box">
            {current ?? "No prompts yet — add a few and try again."}
          </div>

          <div className="activity-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={nextPrompt}
              disabled={!total}
            >
              Next prompt
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setRunning(true)}
              disabled={running || !total}
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
              Team A won (+1)
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addScore(1, 1)}
            >
              Team B won (+1)
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

