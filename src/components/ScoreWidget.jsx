import { Link } from "react-router-dom";
import { useScore } from "../context/ScoreContext";

export default function ScoreWidget() {
  const { teams } = useScore();
  const [a, b] = teams;

  return (
    <div className="scorebar">
      <div className="scorebar-left">
        <span className="score-pill">
          <span className="score-name">{a.name}</span>
          <span className="score-value">{a.score}</span>
        </span>
        <span className="score-pill">
          <span className="score-name">{b.name}</span>
          <span className="score-value">{b.score}</span>
        </span>
      </div>
      <div className="scorebar-right">
        <Link className="score-link" to="/scoreboard">
          Full scoreboard
        </Link>
      </div>
    </div>
  );
}
