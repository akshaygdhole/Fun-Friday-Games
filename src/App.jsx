import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GameLayout from "./components/GameLayout";
import { ScoreProvider } from "./context/ScoreContext";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Scoreboard from "./pages/Scoreboard";
import Icebreakers from "./pages/Icebreakers";
import LetterSprint from "./pages/LetterSprint";
import DrawGame from "./pages/DrawGame";
import TruthsLies from "./pages/TruthsLies";
import RapidFire from "./pages/RapidFire";
import ScavengerHunt from "./pages/ScavengerHunt";
import MemeCaptionBattle from "./pages/MemeCaptionBattle";

export default function App() {
  return (
    <ScoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route element={<GameLayout />}>
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/icebreakers" element={<Icebreakers />} />
            <Route path="/games/categories" element={<LetterSprint />} />
            <Route path="/games/draw" element={<DrawGame />} />
            <Route path="/games/truths-lies" element={<TruthsLies />} />
            <Route path="/games/rapidfire" element={<RapidFire />} />
            <Route path="/games/scavenger-hunt" element={<ScavengerHunt />} />
            <Route path="/games/meme-caption" element={<MemeCaptionBattle />} />
            <Route path="/games/home-hunt" element={<Navigate to="/games/scavenger-hunt" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ScoreProvider>
  );
}
