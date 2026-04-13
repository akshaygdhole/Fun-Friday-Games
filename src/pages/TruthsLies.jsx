import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ScoreWidget from "../components/ScoreWidget";
import { useScore } from "../context/ScoreContext";
import { FUN_FRIDAY_TRUTHS_LIES } from "../data/truths-lies";
import { shuffle } from "../utils/shuffle";

export default function TruthsLies() {
  const rounds = FUN_FRIDAY_TRUTHS_LIES || [];
  const { addScore } = useScore();
  const deckRef = useRef([]);

  const [current, setCurrent] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const newRound = useCallback(() => {
    if (!deckRef.current.length) deckRef.current = shuffle([...rounds]);
    const r = deckRef.current.shift() || null;
    setCurrent(r);
    setRevealed(false);
  }, [rounds]);

  useEffect(() => {
    newRound();
  }, [newRound]);

  const reveal = useCallback(() => {
    if (!current || revealed) return;
    setRevealed(true);
  }, [current, revealed]);

  return (
    <>
      <nav className="page-nav">
        <Link to="/">← Back to hub</Link>
      </nav>
      <main className="page-main">
        <ScoreWidget />
        <h1 className="page-title">Two truths & a lie</h1>
        <p className="page-sub">Teams discuss which statement is the lie, then reveal. Host awards the point.</p>
        <section className="panel">
          <ol className="stmt-list">
            {current ? (
              current.statements.map((s, i) => (
                <li key={i}>
                  <span className="stmt-num">{i + 1}.</span> {s}
                </li>
              ))
            ) : (
              <li>Add items to src/data/truths-lies.js</li>
            )}
          </ol>
          <div className={`feedback feedback--fancy ${revealed && current ? "" : "hidden"}`} role="status">
            {revealed && current ? (
              <>
                <strong>
                  The lie is #{current.lieIndex + 1} ({["A", "B", "C"][current.lieIndex] || current.lieIndex + 1}).
                </strong>
                {current.explain ? (
                  <div style={{ marginTop: "0.5rem", color: "var(--muted)" }}>{current.explain}</div>
                ) : null}
              </>
            ) : null}
          </div>
          <div className="quiz-actions" style={{ justifyContent: "center" }}>
            <button type="button" className="btn btn-primary" onClick={newRound}>
              New round
            </button>
            <button type="button" className="btn btn-ghost" onClick={reveal} disabled={!current || revealed}>
              Reveal lie
            </button>
          </div>
          <div className="quiz-actions" style={{ justifyContent: "center", marginTop: "0.75rem" }}>
            <button type="button" className="btn btn-primary" onClick={() => addScore(0, 1)}>
              Team A guessed right (+1)
            </button>
            <button type="button" className="btn btn-primary" onClick={() => addScore(1, 1)}>
              Team B guessed right (+1)
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
