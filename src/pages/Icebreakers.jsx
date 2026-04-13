import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { FUN_FRIDAY_PROMPTS } from "../data/prompts";

export default function Icebreakers() {
  const [prompt, setPrompt] = useState(null);

  const draw = useCallback(() => {
    const prompts = FUN_FRIDAY_PROMPTS || [];
    if (!prompts.length) return;
    if (prompts.length === 1) {
      setPrompt(prompts[0]);
      return;
    }
    let i = Math.floor(Math.random() * prompts.length);
    let guard = 0;
    while (prompt !== null && prompts[i] === prompt && guard++ < 64) {
      i = Math.floor(Math.random() * prompts.length);
    }
    setPrompt(prompts[i]);
  }, [prompt]);

  const empty = !FUN_FRIDAY_PROMPTS?.length;

  return (
    <>
      <nav className="page-nav">
        <Link to="/">← Back to hub</Link>
      </nav>
      <main className="page-main">
        <h1 className="page-title">Icebreaker prompts</h1>
        <p className="page-sub">Pick someone to answer, or go round-robin in small groups.</p>

        <div className={`prompt-box ${prompt == null ? "placeholder" : ""}`}>
          {empty
            ? "Add prompts to src/data/prompts.js"
            : prompt ?? "Tap “New prompt” to draw a random question."}
        </div>
        <div className="ice-actions">
          <button type="button" className="btn btn-primary" onClick={draw} disabled={empty}>
            New prompt
          </button>
        </div>
      </main>
    </>
  );
}
