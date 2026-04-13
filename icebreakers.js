(function () {
  const prompts = window.FUN_FRIDAY_PROMPTS || [];
  const box = document.getElementById("prompt-box");
  const btn = document.getElementById("btn-new");
  let last = -1;

  function draw() {
    if (!prompts.length) {
      box.textContent = "Add prompts to data/prompts.js";
      box.classList.add("placeholder");
      return;
    }
    let i = Math.floor(Math.random() * prompts.length);
    if (prompts.length > 1) {
      while (i === last) i = Math.floor(Math.random() * prompts.length);
    }
    last = i;
    box.textContent = prompts[i];
    box.classList.remove("placeholder");
  }

  btn.addEventListener("click", draw);
})();
