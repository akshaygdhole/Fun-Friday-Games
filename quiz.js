(function () {
  const questions = window.FUN_FRIDAY_QUESTIONS || [];
  const scoreWidgetEl = document.getElementById("score-widget");
  if (scoreWidgetEl && window.FunFridayScore) {
    window.FunFridayScore.renderScoreWidget(scoreWidgetEl);
  }

  const progressBar = document.getElementById("progress-bar");
  const qLabel = document.getElementById("q-label");
  const scoreLabel = document.getElementById("score-label");
  const questionText = document.getElementById("question-text");
  const optionsEl = document.getElementById("options");
  const feedback = document.getElementById("feedback");
  const btnNext = document.getElementById("btn-next");
  const btnRestart = document.getElementById("btn-restart");
  const quizRoot = document.getElementById("quiz-root");
  const resultRoot = document.getElementById("result-root");
  const resultScore = document.getElementById("result-score");
  const resultLabel = document.getElementById("result-label");
  const btnPlayAgain = document.getElementById("btn-play-again");

  let index = 0;
  let score = 0;
  let answered = false;

  function syncHostTitles() {
    if (!window.FunFridayScore) return;
    const state = window.FunFridayScore.getState();
    const ta = document.getElementById("host-title-a");
    const tb = document.getElementById("host-title-b");
    const ba = document.getElementById("host-a-plus");
    const bb = document.getElementById("host-b-plus");
    const fa = document.getElementById("host-a-foul");
    const fb = document.getElementById("host-b-foul");
    const aName = state.teams[0].name;
    const bName = state.teams[1].name;
    if (ta) ta.textContent = aName;
    if (tb) tb.textContent = bName;
    if (ba) {
      ba.textContent = "+1";
      ba.title = `${aName} — award 1 point`;
      ba.setAttribute("aria-label", `${aName}: award one point`);
    }
    if (bb) {
      bb.textContent = "+1";
      bb.title = `${bName} — award 1 point`;
      bb.setAttribute("aria-label", `${bName}: award one point`);
    }
    if (fa) {
      fa.textContent = "−1";
      fa.title = `${aName} — foul (minus 1)`;
      fa.setAttribute("aria-label", `${aName}: foul minus one point`);
    }
    if (fb) {
      fb.textContent = "−1";
      fb.title = `${bName} — foul (minus 1)`;
      fb.setAttribute("aria-label", `${bName}: foul minus one point`);
    }
  }

  function wireHostScoring() {
    document.querySelectorAll(".host-quiz-scoring [data-team]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const team = parseInt(btn.getAttribute("data-team"), 10);
        const delta = parseInt(btn.getAttribute("data-delta"), 10);
        if (window.FunFridayScore) window.FunFridayScore.addScore(team, delta);
      });
    });
    syncHostTitles();
    window.addEventListener("fun-friday-score-updated", syncHostTitles);
    window.addEventListener("storage", syncHostTitles);
  }

  wireHostScoring();

  function setProgress() {
    const pct = questions.length ? ((index + (answered ? 1 : 0)) / questions.length) * 100 : 0;
    progressBar.style.width = `${Math.min(100, pct)}%`;
    qLabel.textContent = `Question ${index + 1} of ${questions.length}`;
    if (scoreLabel) scoreLabel.textContent = `Reveal: ${score} correct`;
  }

  function showQuestion() {
    answered = false;
    feedback.classList.add("hidden");
    btnNext.classList.add("hidden");
    const q = questions[index];
    questionText.textContent = q.question;
    optionsEl.innerHTML = "";
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.setAttribute("data-letter", letters[i] || String(i + 1));
      btn.addEventListener("click", () => onPick(i));
      optionsEl.appendChild(btn);
    });
    setProgress();
  }

  function onPick(choice) {
    if (answered) return;
    answered = true;
    const q = questions[index];
    const buttons = optionsEl.querySelectorAll(".option-btn");
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correctIndex) btn.classList.add("correct");
      else if (i === choice) btn.classList.add("wrong");
    });
    if (choice === q.correctIndex) score += 1;
    feedback.textContent = q.explain || "";
    feedback.classList.remove("hidden");
    btnNext.classList.remove("hidden");
    setProgress();
  }

  function next() {
    index += 1;
    if (index >= questions.length) {
      quizRoot.classList.add("hidden");
      resultRoot.classList.remove("hidden");
      resultScore.textContent = String(score);
      resultLabel.textContent = `out of ${questions.length}`;
      return;
    }
    showQuestion();
  }

  function restart() {
    index = 0;
    score = 0;
    answered = false;
    quizRoot.classList.remove("hidden");
    resultRoot.classList.add("hidden");
    showQuestion();
  }

  btnNext.addEventListener("click", next);
  btnRestart.addEventListener("click", restart);
  btnPlayAgain.addEventListener("click", restart);

  if (!questions.length) {
    questionText.textContent = "No questions loaded. Add items to data/questions.js";
    optionsEl.innerHTML = "";
    return;
  }
  showQuestion();
})();
