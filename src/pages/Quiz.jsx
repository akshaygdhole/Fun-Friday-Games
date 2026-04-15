import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { FUN_FRIDAY_QUESTIONS } from "../data/questions"

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"]

const QUIZ_QUESTION_SECONDS = 15

/** Q1, Q3… → Team A first; Q2, Q4… → Team B first. Second window is always the other team. */
function firstTeamForQuestion(i) {
  return i % 2 === 0 ? "A" : "B"
}

function otherTeam(t) {
  return t === "A" ? "B" : "A"
}

export default function Quiz() {
  const questions = useMemo(() => FUN_FRIDAY_QUESTIONS || [], [])

  const [index, setIndex] = useState(0)
  const [perQuestion, setPerQuestion] = useState({})
  const [showResult, setShowResult] = useState(false)

  const [timerOn, setTimerOn] = useState(false)
  const [remaining, setRemaining] = useState(QUIZ_QUESTION_SECONDS)
  const [activeWindow, setActiveWindow] = useState(null)
  const activeWindowRef = useRef(null)
  activeWindowRef.current = activeWindow
  const autoStartFirstWindowRef = useRef(false)

  const q = questions[index]
  const slot = perQuestion[index] || {}
  const revealed = slot.revealed === true
  const firstDone = slot.firstDone === true
  const secondDone = slot.secondDone === true

  const teamFirst = firstTeamForQuestion(index)
  const teamSecond = otherTeam(teamFirst)
  const runningTeam =
    activeWindow === "first"
      ? teamFirst
      : activeWindow === "second"
        ? teamSecond
        : null

  const revealedCount = useMemo(
    () =>
      Object.values(perQuestion).filter((s) => s?.revealed === true).length,
    [perQuestion],
  )

  useEffect(() => {
    const runAutoStart = autoStartFirstWindowRef.current
    autoStartFirstWindowRef.current = false

    setTimerOn(false)
    setActiveWindow(null)
    setRemaining(QUIZ_QUESTION_SECONDS)

    if (runAutoStart) {
      queueMicrotask(() => {
        setActiveWindow("first")
        setRemaining(QUIZ_QUESTION_SECONDS)
        setTimerOn(true)
      })
    }
  }, [index])

  useEffect(() => {
    if (!timerOn || showResult || revealed) return undefined
    const t0 = Date.now()
    let cancelled = false
    const id = setInterval(() => {
      if (cancelled) return
      const left = Math.max(
        0,
        QUIZ_QUESTION_SECONDS - Math.floor((Date.now() - t0) / 1000),
      )
      setRemaining(left)
      if (left <= 0) {
        cancelled = true
        clearInterval(id)
        const aw = activeWindowRef.current
        setTimerOn(false)
        setActiveWindow(null)
        setPerQuestion((prev) => {
          const cur = prev[index] || {}
          if (aw === "first") {
            return { ...prev, [index]: { ...cur, firstDone: true } }
          }
          if (aw === "second") {
            return { ...prev, [index]: { ...cur, secondDone: true } }
          }
          return prev
        })
      }
    }, 100)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [timerOn, showResult, revealed, index])

  const finishWindow = useCallback(() => {
    const aw = activeWindowRef.current
    setTimerOn(false)
    setActiveWindow(null)
    setPerQuestion((prev) => {
      const cur = prev[index] || {}
      if (aw === "first") {
        return { ...prev, [index]: { ...cur, firstDone: true } }
      }
      if (aw === "second") {
        return { ...prev, [index]: { ...cur, secondDone: true } }
      }
      return prev
    })
  }, [index])

  const startTimer = useCallback(() => {
    if (revealed || timerOn) return
    if (!firstDone) {
      setActiveWindow("first")
      setRemaining(QUIZ_QUESTION_SECONDS)
      setTimerOn(true)
      return
    }
    if (!secondDone) {
      setActiveWindow("second")
      setRemaining(QUIZ_QUESTION_SECONDS)
      setTimerOn(true)
    }
  }, [revealed, timerOn, firstDone, secondDone])

  const stopTimer = useCallback(() => {
    if (!timerOn) return
    finishWindow()
  }, [timerOn, finishWindow])

  const revealAnswer = useCallback(() => {
    if (revealed) return
    setTimerOn(false)
    setActiveWindow(null)
    setPerQuestion((prev) => ({
      ...prev,
      [index]: { ...prev[index], revealed: true },
    }))
  }, [index, revealed])

  const pct = questions.length
    ? ((index + (revealed ? 1 : 0)) / questions.length) * 100
    : 0

  const next = useCallback(() => {
    if (index + 1 >= questions.length) {
      setShowResult(true)
      return
    }
    autoStartFirstWindowRef.current = true
    setIndex((x) => x + 1)
  }, [index, questions.length])

  const goPrevious = useCallback(() => {
    if (index <= 0 || showResult) return
    setIndex((i) => i - 1)
  }, [index, showResult])

  const restart = useCallback(() => {
    setIndex(0)
    setPerQuestion({})
    setShowResult(false)
    setTimerOn(false)
    setActiveWindow(null)
  }, [])

  const canStartNextWindow =
    !revealed && !timerOn && (!firstDone || (firstDone && !secondDone))

  if (!questions.length) {
    return (
      <div className="quiz-page">
        <div className="bg-pattern" aria-hidden="true" />
        <div className="quiz-layout">
          <div className="quiz-content">
            <nav className="page-nav page-nav--quiz">
              <Link to="/">← Back to hub</Link>
            </nav>
            <p>No questions in src/data/questions.js</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-page">
      <div className="bg-pattern" aria-hidden="true" />
      <div className="quiz-layout quiz-layout-web">
        <div className="quiz-content">
          <nav className="page-nav page-nav--quiz">
            <Link to="/">← Back to hub</Link>
          </nav>

          <header className="quiz-hero quiz-hero-web">
            <h1 className="quiz-hero-title">Team quiz</h1>
            <p className="quiz-hero-lede">
              Two {QUIZ_QUESTION_SECONDS}s buzz windows per question (teams alternate
              which goes first). Use <strong>Start</strong> / <strong>Stop</strong>{" "}
              to control the timer. <strong>Next question</strong> starts Window 1
              automatically.
            </p>
          </header>

          {!showResult ? (
            <article className="quiz-card quiz-card--session" aria-label="Quiz questions">
              <div
                className="quiz-progress quiz-progress--fancy"
                aria-hidden="true"
              >
                <div
                  className="quiz-progress-bar"
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>

              <div className="quiz-session-head">
                <div className="quiz-session-badge">
                  <span className="quiz-session-q">
                    Question {index + 1} / {questions.length}
                  </span>
                  <span className="quiz-session-rounds">
                    Window 1: Team {teamFirst} · Window 2: Team {teamSecond}
                  </span>
                </div>
              </div>

              {timerOn ? (
                <div
                  className={`quiz-timer-dock ${remaining <= 5 ? "quiz-timer-dock--urgent" : ""}`}
                  aria-live="polite"
                >
                  <div className="quiz-timer-dock-label">Buzz window</div>
                  <div className="quiz-timer-dock-team">Team {runningTeam}</div>
                  <div className="quiz-timer-dock-seconds">{remaining}</div>
                  <div className="quiz-timer-dock-unit">seconds left</div>
                </div>
              ) : (
                !revealed && (
                  <div className="quiz-timer-idle">
                    <p className={firstDone && secondDone ? "quiz-timer-idle-open" : ""}>
                      {!firstDone
                        ? `Next: Window 1 — Team ${teamFirst}`
                        : !secondDone
                          ? `Next: Window 2 — Team ${teamSecond}`
                          : "Both buzz windows finished — open floor."}
                    </p>
                  </div>
                )
              )}

              <div className="quiz-host-toolbar quiz-host-toolbar--timer-only">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!canStartNextWindow}
                  onClick={startTimer}
                >
                  Start
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={!timerOn || revealed}
                  onClick={stopTimer}
                >
                  Stop
                </button>
              </div>

              <p className="question-text question-text--fancy quiz-session-question">
                {q.question}
              </p>
              <div
                className="options options--fancy quiz-options-grid"
                role="group"
                aria-label="Answers"
              >
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`option-btn ${revealed && i === q.correctIndex ? "correct" : ""}`}
                    data-letter={LETTERS[i] || String(i + 1)}
                    disabled
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {!revealed ? (
                <div className="quiz-reveal-row">
                  <button
                    type="button"
                    className="btn btn-primary quiz-reveal-btn"
                    onClick={revealAnswer}
                  >
                    Reveal answer
                  </button>
                </div>
              ) : null}
              <div
                className={`feedback feedback--fancy ${revealed ? "" : "hidden"}`}
                role="status"
              >
                {revealed ? q.explain || "" : ""}
              </div>
              <div className="quiz-actions quiz-actions--fancy quiz-session-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={index === 0}
                  onClick={goPrevious}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className={`btn btn-primary ${revealed ? "" : "hidden"}`}
                  onClick={next}
                >
                  Next question
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={restart}
                >
                  Restart quiz
                </button>
              </div>
            </article>
          ) : (
            <article
              className="quiz-card quiz-card--result"
              aria-label="Quiz results"
            >
              <p className="result-eyebrow">Done</p>
              <p className="result-score">{revealedCount}</p>
              <p className="result-label">
                questions revealed (of {questions.length})
              </p>
              <div className="quiz-actions quiz-actions--fancy">
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={questions.length < 1}
                  onClick={() => {
                    setShowResult(false)
                    setIndex(questions.length - 1)
                  }}
                >
                  Back to last question
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={restart}
                >
                  Play again
                </button>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  )
}
