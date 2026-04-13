(function () {
  const scoreWidget = document.getElementById("score-widget");
  window.FunFridayScore.renderScoreWidget(scoreWidget);

  const cards = Array.isArray(window.FUN_FRIDAY_TABOO) ? window.FUN_FRIDAY_TABOO.slice() : [];
  const cardEl = document.getElementById("card");
  const roundLabel = document.getElementById("round-label");
  const turnLabel = document.getElementById("turn-label");
  const btnStart = document.getElementById("btn-start");
  const btnPass = document.getElementById("btn-pass");
  const btnCorrect = document.getElementById("btn-correct");
  const btnFoul = document.getElementById("btn-foul");

  let deck = [];
  let teamTurn = 0;
  let remaining = 60;
  let timer = null;
  let active = false;
  let current = null;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function ensureDeck() {
    if (deck.length) return;
    deck = shuffle(cards.slice());
  }

  function drawCard() {
    ensureDeck();
    current = deck.shift() || null;
    if (!current) {
      cardEl.textContent = "No cards loaded. Add more in data/taboo.js";
      return;
    }
    const forbidden = (current.forbidden || []).map((w) => `<li>${escapeHtml(w)}</li>`).join("");
    cardEl.innerHTML = `
      <div style="text-align:center">
        <div style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 0.75rem;">${escapeHtml(current.word)}</div>
        <div style="color: var(--muted); font-size: 0.95rem; margin-bottom: 0.5rem;">Forbidden:</div>
        <ul style="list-style: none; padding: 0; margin: 0; display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center;">
          ${(current.forbidden || []).map((w) => `<li style="padding:0.25rem 0.5rem; border:1px solid #ffffff1a; border-radius:999px; background:#00000022;">${escapeHtml(w)}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#039;");
  }

  function syncLabels() {
    const state = window.FunFridayScore.getState();
    turnLabel.textContent = `Turn: ${state.teams[teamTurn].name}`;
    roundLabel.textContent = `Round: ${remaining}s`;
  }

  function setActive(isActive) {
    active = isActive;
    btnPass.disabled = !active;
    btnCorrect.disabled = !active;
    btnFoul.disabled = !active;
    btnStart.disabled = active;
  }

  function startTurn() {
    if (active) return;
    remaining = 60;
    setActive(true);
    drawCard();
    syncLabels();

    timer = window.setInterval(() => {
      remaining -= 1;
      syncLabels();
      if (remaining <= 0) endTurn();
    }, 1000);
  }

  function endTurn() {
    if (!active) return;
    setActive(false);
    if (timer) window.clearInterval(timer);
    timer = null;

    teamTurn = teamTurn === 0 ? 1 : 0;
    current = null;
    cardEl.textContent = "Turn over. Next team: press “Start turn”.";
    syncLabels();
  }

  btnStart.addEventListener("click", startTurn);
  btnPass.addEventListener("click", () => drawCard());
  btnCorrect.addEventListener("click", () => {
    window.FunFridayScore.addScore(teamTurn, 1);
    drawCard();
  });
  btnFoul.addEventListener("click", () => {
    window.FunFridayScore.addScore(teamTurn, -1);
    drawCard();
  });

  window.addEventListener("fun-friday-score-updated", syncLabels);
  window.addEventListener("storage", syncLabels);
  syncLabels();
})();

