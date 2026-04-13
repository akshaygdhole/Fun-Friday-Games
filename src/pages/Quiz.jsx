import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FUN_FRIDAY_QUESTIONS } from "../data/questions";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function Quiz() {
  const questions = useMemo(() => FUN_FRIDAY_QUESTIONS || [], []);

  const [index, setIndex] = useState(0);
  const [revealScore, setRevealScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [choice, setChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const q = questions[index];
  const pct = questions.length ? ((index + (answered ? 1 : 0)) / questions.length) * 100 : 0;

  const pick = useCallback(
    (i) => {
      if (answered || !q) return;
      setAnswered(true);
      setChoice(i);
      if (i === q.correctIndex) setRevealScore((s) => s + 1);
    },
    [answered, q]
  );

  const next = useCallback(() => {
    if (index + 1 >= questions.length) {
      setShowResult(true);
      return;
    }
    setIndex((x) => x + 1);
    setAnswered(false);
    setChoice(null);
  }, [index, questions.length]);

  const restart = useCallback(() => {
    setIndex(0);
    setRevealScore(0);
    setAnswered(false);
    setChoice(null);
    setShowResult(false);
  }, []);

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
    );
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
            <p className="quiz-hero-eyebrow">Two teams</p>
            <h1 className="quiz-hero-title">Team quiz</h1>
            <p className="quiz-hero-lede">
              Buzz in or discuss. Use the <strong>sticky bar at the top</strong> for +1 / fouls anytime, or{" "}
              <Link to="/scoreboard">Full scoreboard</Link> to rename teams, add +5, or reset. Tap an answer to reveal
              the correct choice and explanation.
            </p>
          </header>

          {!showResult ? (
            <article className="quiz-card" aria-label="Quiz questions">
              <div className="quiz-progress quiz-progress--fancy" aria-hidden="true">
                <div className="quiz-progress-bar" style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
              <div className="quiz-meta quiz-meta--fancy">
                <span className="quiz-meta-q">
                  Question {index + 1} of {questions.length}
                </span>
                <span className="quiz-meta-reveal" title="Counts answers you revealed as correct by tapping">
                  Reveal: {revealScore} correct
                </span>
              </div>
              <p className="question-text question-text--fancy">{q.question}</p>
              <div className="options options--fancy quiz-options-grid" role="group" aria-label="Answers">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`option-btn ${answered && i === q.correctIndex ? "correct" : ""} ${
                      answered && choice === i && i !== q.correctIndex ? "wrong" : ""
                    }`}
                    data-letter={LETTERS[i] || String(i + 1)}
                    disabled={answered}
                    onClick={() => pick(i)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className={`feedback feedback--fancy ${answered ? "" : "hidden"}`} role="status">
                {answered ? q.explain || "" : ""}
              </div>
              <div className="quiz-actions quiz-actions--fancy">
                <button type="button" className={`btn btn-primary ${answered ? "" : "hidden"}`} onClick={next}>
                  Next question
                </button>
                <button type="button" className="btn btn-ghost" onClick={restart}>
                  Restart quiz
                </button>
              </div>
            </article>
          ) : (
            <article className="quiz-card quiz-card--result" aria-label="Quiz results">
              <p className="result-eyebrow">Reveal tally</p>
              <p className="result-score">{revealScore}</p>
              <p className="result-label">out of {questions.length}</p>
              <button type="button" className="btn btn-primary" onClick={restart}>
                Play again
              </button>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
