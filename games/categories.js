(function () {
  const scoreWidget = document.getElementById("score-widget");
  window.FunFridayScore.renderScoreWidget(scoreWidget);

  const categories = Array.isArray(window.FUN_FRIDAY_CATEGORIES) ? window.FUN_FRIDAY_CATEGORIES.slice() : [];

  const timerLabel = document.getElementById("timer-label");
  const letterLabel = document.getElementById("letter-label");
  const categoryBox = document.getElementById("category-box");
  const btnNew = document.getElementById("btn-new");
  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");
  const btnAPlus = document.getElementById("btn-a-plus");
  const btnBPlus = document.getElementById("btn-b-plus");

  let remaining = 60;
  let timer = null;
  let lastCategory = -1;
  let lastLetter = "";

  function drawLetter() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let l = letters[Math.floor(Math.random() * letters.length)];
    if (letters.length > 1) {
      while (l === lastLetter) l = letters[Math.floor(Math.random() * letters.length)];
    }
    lastLetter = l;
    return l;
  }

  function drawCategory() {
    if (!categories.length) return "Add categories in data/categories.js";
    let i = Math.floor(Math.random() * categories.length);
    if (categories.length > 1) {
      while (i === lastCategory) i = Math.floor(Math.random() * categories.length);
    }
    lastCategory = i;
    return categories[i];
  }

  function sync() {
    timerLabel.textContent = `Timer: ${remaining}s`;
  }

  function setRunning(running) {
    btnStart.disabled = running;
    btnStop.disabled = !running;
  }

  function newRound() {
    remaining = 60;
    sync();
    setRunning(false);
    if (timer) window.clearInterval(timer);
    timer = null;

    const letter = drawLetter();
    const category = drawCategory();
    letterLabel.textContent = `Letter: ${letter}`;
    categoryBox.textContent = category;
  }

  function start() {
    if (timer) return;
    setRunning(true);
    timer = window.setInterval(() => {
      remaining -= 1;
      sync();
      if (remaining <= 0) stop();
    }, 1000);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
    setRunning(false);
  }

  btnNew.addEventListener("click", newRound);
  btnStart.addEventListener("click", start);
  btnStop.addEventListener("click", stop);
  btnAPlus.addEventListener("click", () => window.FunFridayScore.addScore(0, 1));
  btnBPlus.addEventListener("click", () => window.FunFridayScore.addScore(1, 1));

  newRound();
})();

