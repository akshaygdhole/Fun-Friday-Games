import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FUN_FRIDAY_PROMPTS } from "../data/prompts"

function shuffledIndices(n) {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Icebreakers() {
  const [prompt, setPrompt] = useState(null)
  const [order, setOrder] = useState([])
  const [pos, setPos] = useState(-1)

  useEffect(() => {
    document.title = "Livelytics Team Games · Icebreakers"
  }, [])

  const draw = useCallback(() => {
    const prompts = FUN_FRIDAY_PROMPTS || []
    if (!prompts.length) return
    if (prompts.length === 1) {
      setPrompt(prompts[0])
      setOrder([0])
      setPos(0)
      return
    }

    const startNewRound = () => {
      let nextOrder = shuffledIndices(prompts.length)
      if (prompt != null) {
        let guard = 0
        while (nextOrder[0] != null && prompts[nextOrder[0]] === prompt && guard++ < 32) {
          nextOrder = shuffledIndices(prompts.length)
        }
      }
      setOrder(nextOrder)
      setPos(0)
      setPrompt(prompts[nextOrder[0]])
    }

    if (!order.length || pos < 0 || pos >= order.length - 1) {
      startNewRound()
      return
    }

    const nextPos = pos + 1
    setPos(nextPos)
    setPrompt(prompts[order[nextPos]])
  }, [order, pos, prompt])

  const empty = !FUN_FRIDAY_PROMPTS?.length
  const total = FUN_FRIDAY_PROMPTS?.length || 0
  const shown = pos >= 0 && prompt != null ? pos + 1 : 0

  return (
    <div className="activity-page">
      <div className="bg-pattern" aria-hidden="true" />
      <main className="activity-layout">
        <nav className="page-nav page-nav--activity">
          <Link to="/home">← Back to hub</Link>
        </nav>
        <header className="activity-hero--split">
          <h1 className="page-title">Icebreaker prompts</h1>
          <p className="page-sub">Random prompt each draw — take turns answering.</p>
        </header>

        <section className="panel activity-panel">
          <div className="quiz-meta">
            <span>{total ? `Prompt ${Math.min(shown, total)} / ${total}` : "No prompts"}</span>
          </div>
          <div className={`prompt-box ${prompt == null ? "placeholder" : ""}`}>
            {empty
              ? "No prompts yet — add a few and try again."
              : (prompt ?? "Tap “New prompt” to draw a random question.")}
          </div>
          <div className="activity-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={draw}
              disabled={empty}
            >
              New prompt
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
