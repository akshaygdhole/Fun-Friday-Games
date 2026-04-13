(function () {
  const scoreWidget = document.getElementById("score-widget");
  window.FunFridayScore.renderScoreWidget(scoreWidget);

  const items = Array.isArray(window.FUN_FRIDAY_RAPIDFIRE) ? window.FUN_FRIDAY_RAPIDFIRE.slice() : [];
  const qText = document.getElementById("q-text");
  const answerBox = document.getElementById("answer-box");
  const btnNext = document.getElementById("btn-next");
  const btnShow = document.getElementById("btn-show");
  const btnA = document.getElementById("btn-a");
  const btnB = document.getElementById("btn-b");

  let deck = [];
  let current = null;
  let answerVisible = false;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function ensureDeck() {
    if (deck.length) return;
    deck = shuffle(items.slice());
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#039;");
  }

  function nextQuestion() {
    ensureDeck();
    current = deck.shift() || null;
    answerVisible = false;
    answerBox.classList.add("hidden");
    btnShow.disabled = !current;

    if (!current) {
      qText.textContent = "Add questions to data/rapidfire.js";
      return;
    }

    qText.textContent = current.q;
  }

  function showAnswer() {
    if (!current || answerVisible) return;
    answerVisible = true;
    answerBox.innerHTML = `<strong>Answer:</strong> ${escapeHtml(current.a)}`;
    answerBox.classList.remove("hidden");
  }

  btnNext.addEventListener("click", nextQuestion);
  btnShow.addEventListener("click", showAnswer);
  btnA.addEventListener("click", () => window.FunFridayScore.addScore(0, 1));
  btnB.addEventListener("click", () => window.FunFridayScore.addScore(1, 1));

  nextQuestion();
})();
