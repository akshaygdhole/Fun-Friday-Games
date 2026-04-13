import { Outlet } from "react-router-dom";
import StickyScoreBar from "./StickyScoreBar";

export default function GameLayout() {
  return (
    <div className="game-layout">
      <StickyScoreBar />
      <Outlet />
    </div>
  );
}
