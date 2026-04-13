import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ScoreWidget from "../components/ScoreWidget";
import { useScore } from "../context/ScoreContext";
import { FUN_FRIDAY_TABOO } from "../data/taboo";
import { shuffle } from "../utils/shuffle";

export default function Taboo() {
  const cards = FUN_FRIDAY_TABOO || [];
  const { teams, addScore } = useScore();
  const deckRef = useRef([]);

  const [teamTurn, setTeamTurn] = useState(0);
  const [remaining, setRemaining] = useState(60);
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState(null);
  const [idleMsg, setIdleMsg] = useState('Press "Start turn" to begin.');

  const drawCard = useCallback(() => {
    if (!deckRef.current.length) deckRef.current = shuffle([...cards]);
    const next = deckRef.current.shift() || null;
    if (!next) {
      setIdleMsg("No cards loaded. Add more in src/data/taboo.js");
      setCurrent(null);
      return;
    }
    setCurrent(next);
  }, [cards]);

  const endTurn = useCallback(() => {
    setActive(false);
    setTeamTurn((t) => (t === 0 ? 1 : 0));
    setCurrent(null);
    setIdleMsg('Turn over. Next team: press "Start turn".');
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          endTurn();
          return 60;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, endTurn]);

  const startTurn = useCallback(() => {
    if (active) return;
    setRemaining(60);
    setActive(true);
    setIdleMsg("");
    drawCard();
  }, [active, drawCard]);

  const pass = useCallback(() => {
    if (active) drawCard();
  }, [active, drawCard]);

  const onCorrect = useCallback(() => {
    if (!active) return;
    addScore(teamTurn, 1);
    drawCard();
  }, [active, addScore, teamTurn, drawCard]);

  const onFoul = useCallback(() => {
    if (!active) return;
    addScore(teamTurn, -1);
    drawCard();
  }, [active, addScore, teamTurn, drawCard]);

  return (
    <>
      <nav className="page-nav">
        <Link to="/">← Back to hub</Link>
      </nav>
      <main className="page-main">
        <ScoreWidget />
        <h1 className="page-title">Taboo-style guessing</h1>
        <p className="page-sub">
          One player describes the word without using the forbidden words. First team to hit a target score wins.
        </p>
        <section className="panel">
          <div className="quiz-meta">
            <span>Round: {remaining}s</span>
            <span>Turn: {teams[teamTurn].name}</span>
          </div>
          <div className="prompt-box" id="card">
            {current ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "0.75rem" }}>
                  {current.word}
                </div>
                <div style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: "0.5rem" }}>Forbidden:</div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {(current.forbidden || []).map((w) => (
                    <li
                      key={w}
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid #ffffff1a",
                        borderRadius: "999px",
                        background: "#00000022",
                      }}
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              idleMsg
            )}
          </div>
          <div className="quiz-actions" style={{ justifyContent: "center" }}>
            <button type="button" className="btn btn-primary" onClick={startTurn} disabled={active}>
              Start turn
            </button>
            <button type="button" className="btn btn-ghost" onClick={pass} disabled={!active}>
              Pass
            </button>
            <button type="button" className="btn btn-primary" onClick={onCorrect} disabled={!active}>
              Correct (+1)
            </button>
            <button type="button" className="btn btn-ghost" onClick={onFoul} disabled={!active}>
              Foul (-1)
            </button>
          </div>
          <p className="page-sub" style={{ margin: "1rem 0 0" }}>
            Tip: with ~12-15 people, use two teams of ~6-8. Rotate who gives clues each card so everyone gets a turn.
          </p>
        </section>
      </main>
    </>
  );
}
