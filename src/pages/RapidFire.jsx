import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ScoreWidget from "../components/ScoreWidget";
import { useScore } from "../context/ScoreContext";
import { FUN_FRIDAY_RAPIDFIRE } from "../data/rapidfire";
import { shuffle } from "../utils/shuffle";

export default function RapidFire() {
  const items = FUN_FRIDAY_RAPIDFIRE || [];
  const { addScore } = useScore();
  const deckRef = useRef([]);
  const seeded = useRef(false);

  const [current, setCurrent] = useState(null);
  const [answerVisible, setAnswerVisible] = useState(false);

  const nextQuestion = useCallback(() => {
    if (!deckRef.current.length) deckRef.current = shuffle([...items]);
    const q = deckRef.current.shift() || null;
    setCurrent(q);
    setAnswerVisible(false);
  }, [items]);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    nextQuestion();
  }, [nextQuestion]);

  return (
    <>
      <nav className="page-nav">
        <Link to="/">← Back to hub</Link>
      </nav>
      <main className="page-main">
        <ScoreWidget />
        <h1 className="page-title">Rapid-fire</h1>
        <p className="page-sub">
          Read the question aloud. First team to answer gets the point (honor system or raise hands). Then show the
          answer.
        </p>
        <section className="panel">
          <p className="question-text" style={{ marginBottom: "1rem" }}>
            {current ? current.q : "Add questions to src/data/rapidfire.js"}
          </p>
          <div className={`feedback feedback--fancy ${answerVisible ? "" : "hidden"}`}>
            {answerVisible && current ? (
              <>
                <strong>Answer:</strong> {current.a}
              </>
            ) : null}
          </div>
          <div className="quiz-actions" style={{ justifyContent: "center" }}>
            <button type="button" className="btn btn-primary" onClick={nextQuestion}>
              Next question
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setAnswerVisible(true)} disabled={!current}>
              Show answer
            </button>
          </div>
          <div className="quiz-actions" style={{ justifyContent: "center", marginTop: "0.75rem" }}>
            <button type="button" className="btn btn-primary" onClick={() => addScore(0, 1)}>
              Team A +1
            </button>
            <button type="button" className="btn btn-primary" onClick={() => addScore(1, 1)}>
              Team B +1
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
