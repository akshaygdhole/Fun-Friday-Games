(() => {
  const STORAGE_KEY = "fun_friday_score_v1";

  function readState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function defaultState() {
    return {
      teams: [
        { name: "Team A", score: 0 },
        { name: "Team B", score: 0 },
      ],
    };
  }

  function writeState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("fun-friday-score-updated", { detail: state }));
  }

  function getState() {
    const state = readState();
    if (
      state &&
      Array.isArray(state.teams) &&
      state.teams.length === 2 &&
      typeof state.teams[0]?.score === "number" &&
      typeof state.teams[1]?.score === "number"
    ) {
      return state;
    }
    const fresh = defaultState();
    writeState(fresh);
    return fresh;
  }

  function setTeamName(teamIndex, name) {
    const state = getState();
    state.teams[teamIndex].name = String(name || "").trim() || (teamIndex === 0 ? "Team A" : "Team B");
    writeState(state);
  }

  function addScore(teamIndex, delta) {
    const state = getState();
    state.teams[teamIndex].score = Math.max(0, (state.teams[teamIndex].score || 0) + delta);
    writeState(state);
  }

  function resetScores() {
    const state = getState();
    state.teams[0].score = 0;
    state.teams[1].score = 0;
    writeState(state);
  }

  function scoreboardPageHref() {
    const path = window.location.pathname || "";
    return path.includes("/games/") ? "../scoreboard.html" : "scoreboard.html";
  }

  function renderScoreWidget(targetEl) {
    if (!targetEl) return;

    const boardHref = scoreboardPageHref();

    targetEl.innerHTML = `
      <div class="scorebar">
        <div class="scorebar-left">
          <span class="score-pill" data-team="0">
            <span class="score-name" id="ff-team0-name">Team A</span>
            <span class="score-value" id="ff-team0-score">0</span>
          </span>
          <span class="score-pill" data-team="1">
            <span class="score-name" id="ff-team1-name">Team B</span>
            <span class="score-value" id="ff-team1-score">0</span>
          </span>
        </div>
        <div class="scorebar-right">
          <a class="score-link" href="${boardHref}">Scoreboard</a>
        </div>
      </div>
    `;

    function sync() {
      const state = getState();
      const t0 = state.teams[0];
      const t1 = state.teams[1];
      const n0 = targetEl.querySelector("#ff-team0-name");
      const n1 = targetEl.querySelector("#ff-team1-name");
      const s0 = targetEl.querySelector("#ff-team0-score");
      const s1 = targetEl.querySelector("#ff-team1-score");
      if (n0) n0.textContent = t0.name;
      if (n1) n1.textContent = t1.name;
      if (s0) s0.textContent = String(t0.score);
      if (s1) s1.textContent = String(t1.score);
    }

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("fun-friday-score-updated", sync);
  }

  window.FunFridayScore = {
    getState,
    setTeamName,
    addScore,
    resetScores,
    renderScoreWidget,
  };
})();

