import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useScore } from "../context/ScoreContext";
import { FUN_FRIDAY_DRAW_PROMPTS } from "../data/draw-prompts";
import { shuffle } from "../utils/shuffle";

export default function DrawGame() {
  const prompts = FUN_FRIDAY_DRAW_PROMPTS || [];
  const { teams, addScore } = useScore();
  const deckRef = useRef([]);

  const [teamTurn, setTeamTurn] = useState(0);
  const [remaining, setRemaining] = useState(60);
  const [active, setActive] = useState(false);
  const [word, setWord] = useState(null);
  const [idleMsg, setIdleMsg] = useState("Press Start turn.");

  const drawCard = useCallback(() => {
    if (!deckRef.current.length) deckRef.current = shuffle([...prompts]);
    const w = deckRef.current.shift();
    if (!w) {
      setIdleMsg("No prompts in src/data/draw-prompts.js");
      setWord(null);
      return;
    }
    setWord(w);
  }, [prompts]);

  const endTurn = useCallback(() => {
    setActive(false);
    setTeamTurn((t) => (t === 0 ? 1 : 0));
    setWord(null);
    setIdleMsg("Turn over. Next team: press Start turn.");
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
            Draw on paper/whiteboard, or give emoji-only hints in chat. 60s turns, alternate teams. Works well with ~6-8
            per side.
          </p>
        </header>
        <section className="panel activity-panel">
          <div className="quiz-meta">
            <span>Round: {remaining}s</span>
            <span>Turn: {teams[teamTurn].name}</span>
          </div>
          <div className="prompt-box">
            {word ? (
              <div className="taboo-card-inner">
                <div className="draw-word">{word}</div>
                <p className="draw-hint">Draw it - or use emoji-only hints in chat (no words).</p>
              </div>
            ) : (
              idleMsg
            )}
          </div>
          <div className="activity-actions">
            <button type="button" className="btn btn-primary" onClick={startTurn} disabled={active}>
              Start turn
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => active && drawCard()} disabled={!active}>
              Pass
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (!active) return;
                addScore(teamTurn, 1);
                drawCard();
              }}
              disabled={!active}
            >
              Correct (+1)
            </button>
          </div>
          <p className="activity-tip">
            Edit prompts in <code>src/data/draw-prompts.js</code>.
          </p>
        </section>
      </main>
    </div>
  );
}
