import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ScoreProvider } from "./context/ScoreContext";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Scoreboard from "./pages/Scoreboard";
import Icebreakers from "./pages/Icebreakers";
import Taboo from "./pages/Taboo";
import Categories from "./pages/Categories";
import DrawGame from "./pages/DrawGame";
import TruthsLies from "./pages/TruthsLies";
import RapidFire from "./pages/RapidFire";

export default function App() {
  return (
    <ScoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/icebreakers" element={<Icebreakers />} />
          <Route path="/games/taboo" element={<Taboo />} />
          <Route path="/games/categories" element={<Categories />} />
          <Route path="/games/draw" element={<DrawGame />} />
          <Route path="/games/truths-lies" element={<TruthsLies />} />
          <Route path="/games/rapidfire" element={<RapidFire />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ScoreProvider>
  );
}
