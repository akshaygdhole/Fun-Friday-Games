import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="activity-page">
      <div className="bg-pattern" aria-hidden="true" />
      <main className="activity-layout">
        <nav className="page-nav page-nav--activity">
          <Link to="/">← Back to hub</Link>
        </nav>
        <header className="activity-hero--split">
          <h1 className="page-title">Two truths & a lie</h1>
          <p className="page-sub">Teams discuss which statement is the lie, then reveal. Host awards the point.</p>
        </header>
        <section className="panel activity-panel">
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
                {current.explain ? <div className="activity-explain">{current.explain}</div> : null}
              </>
            ) : null}
          </div>
          <div className="activity-actions">
            <button type="button" className="btn btn-primary" onClick={newRound}>
              New round
            </button>
            <button type="button" className="btn btn-ghost" onClick={reveal} disabled={!current || revealed}>
              Reveal lie
            </button>
          </div>
          <div className="activity-actions activity-actions--spaced activity-actions--grid">
            <button type="button" className="btn btn-primary" onClick={() => addScore(0, 1)}>
              Team A guessed right (+1)
            </button>
            <button type="button" className="btn btn-primary" onClick={() => addScore(1, 1)}>
              Team B guessed right (+1)
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
