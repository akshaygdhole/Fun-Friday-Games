(function () {
  const scoreWidget = document.getElementById("score-widget");
  window.FunFridayScore.renderScoreWidget(scoreWidget);

  const rounds = Array.isArray(window.FUN_FRIDAY_TRUTHS_LIES) ? window.FUN_FRIDAY_TRUTHS_LIES.slice() : [];
  const stmtList = document.getElementById("stmt-list");
  const revealBox = document.getElementById("reveal-box");
  const btnNew = document.getElementById("btn-new");
  const btnReveal = document.getElementById("btn-reveal");
  const btnA = document.getElementById("btn-a");
  const btnB = document.getElementById("btn-b");

  let deck = [];
  let current = null;
  let revealed = false;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function ensureDeck() {
    if (deck.length) return;
    deck = shuffle(rounds.slice());
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderRound() {
    ensureDeck();
    current = deck.shift() || null;
    revealed = false;
    revealBox.classList.add("hidden");
    btnReveal.disabled = !current;

    if (!current) {
      stmtList.innerHTML = "<li>Add items to data/truths-lies.js</li>";
      return;
    }

    stmtList.innerHTML = current.statements
      .map((s, i) => `<li><span class="stmt-num">${i + 1}.</span> ${escapeHtml(s)}</li>`)
      .join("");
  }

  function reveal() {
    if (!current || revealed) return;
    revealed = true;
    const idx = current.lieIndex;
    const letter = ["A", "B", "C"][idx] || String(idx + 1);
    const explain = current.explain ? `<div style="margin-top:0.5rem;color:var(--muted)">${escapeHtml(current.explain)}</div>` : "";
    revealBox.innerHTML = `<strong>The lie is #${idx + 1} (${letter}).</strong>${explain}`;
    revealBox.classList.remove("hidden");
    btnReveal.disabled = true;
  }

  btnNew.addEventListener("click", () => {
    renderRound();
  });
  btnReveal.addEventListener("click", reveal);
  btnA.addEventListener("click", () => window.FunFridayScore.addScore(0, 1));
  btnB.addEventListener("click", () => window.FunFridayScore.addScore(1, 1));

  renderRound();
})();
