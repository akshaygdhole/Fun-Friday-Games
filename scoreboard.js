(function () {
  const root = document.getElementById("scoreboard-root");
  const btnReset = document.getElementById("btn-reset");

  function render() {
    const state = window.FunFridayScore.getState();
    root.innerHTML = state.teams
      .map(
        (t, idx) => `
          <div class="scorecard" data-team="${idx}">
            <label class="field-label" for="team-${idx}-name">Team name</label>
            <input class="text-input" id="team-${idx}-name" value="${escapeHtml(t.name)}" />
            <div class="big-score" aria-label="Score">${t.score}</div>
            <div class="score-buttons" aria-label="Score controls">
              <button class="btn btn-primary" type="button" data-action="plus1">+1</button>
              <button class="btn btn-ghost" type="button" data-action="minus1">-1</button>
              <button class="btn btn-ghost" type="button" data-action="plus5">+5</button>
            </div>
          </div>
        `
      )
      .join("");

    state.teams.forEach((_, idx) => {
      const input = root.querySelector(`#team-${idx}-name`);
      input.addEventListener("input", (e) => window.FunFridayScore.setTeamName(idx, e.target.value));

      const card = root.querySelector(`.scorecard[data-team="${idx}"]`);
      card.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;
        const action = btn.getAttribute("data-action");
        if (action === "plus1") window.FunFridayScore.addScore(idx, 1);
        if (action === "minus1") window.FunFridayScore.addScore(idx, -1);
        if (action === "plus5") window.FunFridayScore.addScore(idx, 5);
      });
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#039;");
  }

  btnReset.addEventListener("click", () => window.FunFridayScore.resetScores());

  render();
  window.addEventListener("storage", render);
  window.addEventListener("fun-friday-score-updated", render);
})();

