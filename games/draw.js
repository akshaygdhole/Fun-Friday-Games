(function () {
  const scoreWidget = document.getElementById("score-widget");
  window.FunFridayScore.renderScoreWidget(scoreWidget);

  const prompts = Array.isArray(window.FUN_FRIDAY_DRAW_PROMPTS) ? window.FUN_FRIDAY_DRAW_PROMPTS.slice() : [];
  const cardEl = document.getElementById("card");
  const roundLabel = document.getElementById("round-label");
  const turnLabel = document.getElementById("turn-label");
  const btnStart = document.getElementById("btn-start");
  const btnPass = document.getElementById("btn-pass");
  const btnCorrect = document.getElementById("btn-correct");

  let deck = [];
  let teamTurn = 0;
  let remaining = 60;
  let timer = null;
  let active = false;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function ensureDeck() {
    if (deck.length) return;
    deck = shuffle(prompts.slice());
  }

  function drawCard() {
    ensureDeck();
    const word = deck.shift();
    if (!word) {
      cardEl.textContent = "No prompts in data/draw-prompts.js";
      return;
    }
    cardEl.innerHTML = `
      <div style="text-align:center">
        <div style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 0.75rem;">${escapeHtml(word)}</div>
        <p style="margin:0; color: var(--muted); font-size: 0.95rem; font-family: var(--font);">
          Draw it - or use emoji-only hints in chat (no words).
        </p>
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
    cardEl.textContent = "Turn over. Next team: press Start turn.";
    syncLabels();
  }

  btnStart.addEventListener("click", startTurn);
  btnPass.addEventListener("click", () => drawCard());
  btnCorrect.addEventListener("click", () => {
    window.FunFridayScore.addScore(teamTurn, 1);
    drawCard();
  });

  window.addEventListener("fun-friday-score-updated", syncLabels);
  window.addEventListener("storage", syncLabels);
  syncLabels();
})();
