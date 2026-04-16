import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useScore } from "../context/ScoreContext"
import { FUN_FRIDAY_CATEGORIES } from "../data/categories"
import { shuffle } from "../utils/shuffle"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default function LetterSprint() {
  const categories = FUN_FRIDAY_CATEGORIES || []
  const { addScore } = useScore()
  const deckRef = useRef([])
  const [remaining, setRemaining] = useState(60)
  const [running, setRunning] = useState(false)
  const [letter, setLetter] = useState("A")
  const [category, setCategory] = useState("Press “New round”.")
  const [lastLetter, setLastLetter] = useState("")
  const [roundNum, setRoundNum] = useState(0)

  useEffect(() => {
    document.title = "Livelytics Team Games · Letter Sprint"
  }, [])

  const drawLetter = useCallback(() => {
    let l = ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    let g = 0
    while (l === lastLetter && g++ < 32)
      l = ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    setLastLetter(l)
    return l
  }, [lastLetter])

  const drawCategory = useCallback(() => {
    if (!categories.length) return "No categories yet — add a few and try again."
    if (!deckRef.current.length) {
      deckRef.current = shuffle([...categories])
      setRoundNum(0)
    }
    setRoundNum((n) => n + 1)
    return deckRef.current.shift()
  }, [categories])

  const newRound = useCallback(() => {
    setRemaining(60)
    setRunning(false)
    setLetter(drawLetter())
    setCategory(drawCategory())
  }, [drawLetter, drawCategory])

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

  return (
    <div className="activity-page">
      <div className="bg-pattern" aria-hidden="true" />
      <main className="activity-layout">
        <nav className="page-nav page-nav--activity">
          <Link to="/">← Back to hub</Link>
        </nav>
        <header className="activity-hero--split">
          <h1 className="page-title">Letter Sprint</h1>
          <p className="page-sub">
            You get a category + letter. Teams have 60 seconds to list as many
            answers as possible that start with that letter.
          </p>
        </header>
        <section className="panel activity-panel">
          <div className="quiz-meta">
            <span>Timer: {remaining}s</span>
            <span>Letter: {letter}</span>
            <span>
              {categories.length
                ? `Category ${Math.min(roundNum, categories.length)} / ${categories.length}`
                : "No categories"}
            </span>
          </div>
          <div className="prompt-box">{category}</div>
          <div className="activity-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={newRound}
            >
              New round
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setRunning(true)}
              disabled={running}
            >
              Start 60s
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setRunning(false)}
              disabled={!running}
            >
              Stop
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

