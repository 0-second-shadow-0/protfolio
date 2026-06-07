// Floating blob follows cursor slightly
const blob = document.querySelector(".blob");

document.addEventListener("mousemove", (e) => {
  blob.style.transform = `translate(${e.clientX / 10}px, ${e.clientY / 10}px)`;
});

// Dreamy purple flare on click
document.addEventListener("click", function (e) {
  const flare = document.createElement("span");
  flare.classList.add("flare");
  flare.style.left = e.clientX + "px";
  flare.style.top = e.clientY + "px";
  flare.style.width = "120px";
  flare.style.height = "120px";
  document.body.appendChild(flare);
  setTimeout(() => flare.remove(), 1200);
});

// Desmos 3D Water Ripple
(function() {
  const elt = document.getElementById("desmos-3d");
  if (!elt) return;

  function init() {
    if (typeof Desmos === "undefined") {
      setTimeout(init, 500);
      return;
    }
    try {
      const calculator = Desmos.Calculator3D(elt, {
        expressionsCollapsed: true,
        showGrid: false,
        showXAxis: false,
        showYAxis: false,
        showZAxis: false,
        brailleMode: false,
      });
      calculator.setExpression({
        id: "ripple",
        latex: "z = \\sin\\left(2\\sqrt{x^2 + y^2} - 3t\\right) \\cdot e^{-0.08x^2 - 0.08y^2}",
      });
      calculator.setExpression({
        id: "t",
        type: "slider",
        latex: "t",
        min: "0",
        max: "10",
        step: "0.05",
        loop: true,
      });
    } catch (e) {
      elt.innerHTML = '<p style="padding:20px;color:#888;">3D viewer unavailable</p>';
    }
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();

// Game of Life 100x100
(function() {
  const canvas = document.getElementById("gol-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const COLS = 100;
  const ROWS = 100;
  const CELL_SIZE = 5;

  canvas.width = COLS * CELL_SIZE;
  canvas.height = ROWS * CELL_SIZE;

  let grid = Array.from({ length: COLS }, () => Array(ROWS).fill(0));
  let running = false;
  let interval = null;

  function countNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        count += grid[(x + i + COLS) % COLS][(y + j + ROWS) % ROWS];
      }
    }
    return count;
  }

  function step() {
    const newGrid = Array.from({ length: COLS }, () => Array(ROWS).fill(0));
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        const n = countNeighbors(x, y);
        if (grid[x][y] === 1) {
          newGrid[x][y] = n === 2 || n === 3 ? 1 : 0;
        } else {
          newGrid[x][y] = n === 3 ? 1 : 0;
        }
      }
    }
    grid = newGrid;
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        if (grid[x][y]) {
          ctx.fillStyle = "#6c63ff";
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }
  }

  function randomize() {
    grid = Array.from({ length: COLS }, () =>
      Array.from({ length: ROWS }, () => (Math.random() > 0.7 ? 1 : 0))
    );
    draw();
  }

  function clearGrid() {
    grid = Array.from({ length: COLS }, () => Array(ROWS).fill(0));
    draw();
  }

  function toggleRun() {
    running = !running;
    if (running) {
      interval = setInterval(step, 50);
      document.getElementById("gol-toggle").textContent = "Stop";
    } else {
      clearInterval(interval);
      interval = null;
      document.getElementById("gol-toggle").textContent = "Start";
    }
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
      grid[x][y] = grid[x][y] ? 0 : 1;
      draw();
    }
  });

  document.getElementById("gol-toggle").addEventListener("click", toggleRun);
  document.getElementById("gol-random").addEventListener("click", randomize);
  document.getElementById("gol-clear").addEventListener("click", clearGrid);

  randomize();
})();
