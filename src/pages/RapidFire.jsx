import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useScore } from "../context/ScoreContext"
import { FUN_FRIDAY_RAPIDFIRE } from "../data/rapidfire"
import { shuffle } from "../utils/shuffle"

export default function RapidFire() {
  const items = FUN_FRIDAY_RAPIDFIRE || []
  const { addScore } = useScore()
  const deckRef = useRef([])
  const lastQRef = useRef(null)
  const seeded = useRef(false)

  const [current, setCurrent] = useState(null)
  const [answerVisible, setAnswerVisible] = useState(false)
  const [qNum, setQNum] = useState(0)

  useEffect(() => {
    document.title = "Livelytics Team Games · Rapid-fire"
  }, [])

  const nextQuestion = useCallback(() => {
    if (!items.length) {
      setCurrent(null)
      return
    }

    // Rebuild the deck only after every question has been used once.
    if (!deckRef.current.length) {
      let nextDeck = shuffle([...items])
      // Avoid showing the same question twice in a row when a new round starts.
      if (items.length > 1 && lastQRef.current != null) {
        let guard = 0
        while (nextDeck[0] === lastQRef.current && guard++ < 32) {
          nextDeck = shuffle([...items])
        }
      }
      deckRef.current = nextDeck
      setQNum(0)
    }

    const q = deckRef.current.shift() || null
    lastQRef.current = q
    setCurrent(q)
    setAnswerVisible(false)
    setQNum((n) => n + 1)
  }, [items])

  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    nextQuestion()
  }, [nextQuestion])

  return (
    <div className="activity-page">
      <div className="bg-pattern" aria-hidden="true" />
      <main className="activity-layout">
        <nav className="page-nav page-nav--activity">
          <Link to="/home">← Back to hub</Link>
        </nav>
        <header className="activity-hero--split">
          <h1 className="page-title">Rapid-fire</h1>
          <p className="page-sub">
            1 question at a time. First team to shout the correct answer gets
            +1. Tap Show answer if needed, then Next.
          </p>
        </header>
        <section className="panel activity-panel">
          <div className="quiz-meta">
            <span>
              {items.length
                ? `Question ${Math.min(qNum, items.length)} / ${items.length}`
                : "No questions"}
            </span>
          </div>
          <p className="activity-question">
            {current ? current.q : "No questions yet — add a few and try again."}
          </p>
          <div
            className={`feedback feedback--fancy ${answerVisible ? "" : "hidden"}`}
          >
            {answerVisible && current ? (
              <>
                <strong>Answer:</strong> {current.a}
              </>
            ) : null}
          </div>
          <div className="activity-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={nextQuestion}
            >
              Next question
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setAnswerVisible(true)}
              disabled={!current}
            >
              Show answer
            </button>
          </div>
          <div className="activity-actions activity-actions--spaced activity-actions--grid">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addScore(0, 1)}
            >
              Team A +1
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addScore(1, 1)}
            >
              Team B +1
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
