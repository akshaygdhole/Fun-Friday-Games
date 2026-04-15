import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useScore } from "../context/ScoreContext"
import { FUN_FRIDAY_DRAW_PROMPTS } from "../data/draw-prompts"
import { shuffle } from "../utils/shuffle"

const DRAW_SECONDS = 15

function shuffledIndices(n) {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function DrawGame() {
  const prompts = FUN_FRIDAY_DRAW_PROMPTS || []
  const { addScore } = useScore()

  const [remaining, setRemaining] = useState(DRAW_SECONDS)
  const [active, setActive] = useState(false)
  const [word, setWord] = useState(null)
  const [idleMsg, setIdleMsg] = useState("Tap Next to start.")
  const [order, setOrder] = useState([])
  const [pos, setPos] = useState(-1)

  const endRound = useCallback((msg = "Round over. Next: press Start round.") => {
    setActive(false)
    setIdleMsg(msg)
  }, [])

  useEffect(() => {
    if (!active) return undefined
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          endRound("Time! Tap Next for a new prompt.")
          return DRAW_SECONDS
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [active, endRound])

  const startTimerForWord = useCallback(() => {
    setRemaining(DRAW_SECONDS)
    setActive(true)
    setIdleMsg("")
  }, [])

  const next = useCallback(() => {
    if (!prompts.length) return

    // Start a new shuffled round if we haven't started yet,
    // or if we're currently at the end of the round.
    if (!order.length || pos < 0 || pos >= order.length - 1) {
      const nextOrder = shuffledIndices(prompts.length)
      const nextPos = 0
      setOrder(nextOrder)
      setPos(nextPos)
      setWord(prompts[nextOrder[nextPos]])
      startTimerForWord()
      return
    }

    const nextPos = pos + 1
    setPos(nextPos)
    setWord(prompts[order[nextPos]])
    startTimerForWord()
  }, [prompts, order, pos, startTimerForWord])

  const previous = useCallback(() => {
    if (!order.length || pos <= 0) return
    const prevPos = pos - 1
    setPos(prevPos)
    setWord(prompts[order[prevPos]])
    startTimerForWord()
  }, [order, pos, prompts, startTimerForWord])

  const total = prompts.length
  const shown = pos >= 0 ? pos + 1 : 0
  return (
    <div className="activity-page">
      <div className="bg-pattern" aria-hidden="true" />
      <main className="activity-layout">
        <nav className="page-nav page-nav--activity">
          <Link to="/">← Back to hub</Link>
        </nav>
        <header className="activity-hero--split">
          <h1 className="page-title">Draw & guess</h1>
          <p className="page-sub">
            15-second rounds. Draw (or use emoji-only hints) — first team to
            guess gets +1. No spoken words.
          </p>
        </header>
        <section className="panel activity-panel">
          <div className="quiz-meta">
            <span>Round: {remaining}s</span>
            <span>
              {total ? `Prompt ${shown} / ${total}` : "No prompts"}
            </span>
          </div>
          <div className="prompt-box">
            {word ? (
              <div className="taboo-card-inner">
                <div className="draw-word">{word}</div>
                <p className="draw-hint">
                  Draw it - or use emoji-only hints in chat (no words).
                </p>
              </div>
            ) : (
              idleMsg
            )}
          </div>
          <div className="activity-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={previous}
              disabled={!total || pos <= 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={next}
              disabled={!total}
            >
              Next
            </button>
          </div>
          <div className="activity-actions activity-actions--spaced activity-actions--grid">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (!active) return
                addScore(0, 1)
                endRound()
              }}
              disabled={!active}
            >
              Team A guessed first (+1)
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (!active) return
                addScore(1, 1)
                endRound()
              }}
              disabled={!active}
            >
              Team B guessed first (+1)
            </button>
          </div>

          <p className="activity-tip">Tip: no words—only drawings or emojis.</p>
        </section>
      </main>
    </div>
  )
}
