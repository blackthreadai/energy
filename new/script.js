const css = getComputedStyle(document.documentElement);
const green = css.getPropertyValue("--green").trim();
const red = css.getPropertyValue("--red").trim();
const gold = css.getPropertyValue("--gold").trim();

function drawSparkline(canvas, type) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 58;
  const height = canvas.clientHeight || 28;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const patterns = {
    up: [0.26, 0.38, 0.33, 0.52, 0.46, 0.68, 0.62, 0.74, 0.7, 0.86],
    slow: [0.28, 0.34, 0.31, 0.4, 0.38, 0.48, 0.45, 0.58, 0.55, 0.64],
    down: [0.76, 0.62, 0.68, 0.54, 0.6, 0.48, 0.52, 0.38, 0.43, 0.31],
  };
  const data = patterns[type] || patterns.up;
  const color = type === "down" ? red : green;

  ctx.lineWidth = 1.4;
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 7;
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - point * height + 2;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawMarketChart() {
  const canvas = document.querySelector("#marketChart");
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 520;
  const height = canvas.clientHeight || 104;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const candles = [
    42, 47, 39, 53, 49, 58, 44, 50, 57, 63, 59, 72, 67, 61, 69, 78, 73, 82,
    77, 84, 88, 80, 76, 83, 91, 87, 96, 90, 84, 89, 78, 74, 82, 86, 79, 88,
    93, 98, 90, 101, 96, 104, 110, 106, 99, 94, 103, 111, 116, 108, 121, 118,
  ];

  ctx.strokeStyle = "rgba(185, 207, 205, 0.1)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = 14 + i * 25;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const max = Math.max(...candles);
  const min = Math.min(...candles);
  const step = width / candles.length;
  candles.forEach((value, index) => {
    const previous = candles[Math.max(0, index - 1)];
    const x = index * step + step * 0.4;
    const y = height - ((value - min) / (max - min)) * (height - 20) - 10;
    const py = height - ((previous - min) / (max - min)) * (height - 20) - 10;
    const up = value >= previous;
    const color = up ? green : "#ff8b42";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.94;
    ctx.beginPath();
    ctx.moveTo(x, y - 9);
    ctx.lineTo(x, y + 10);
    ctx.stroke();
    ctx.fillRect(x - 2.3, Math.min(y, py), 4.6, Math.max(5, Math.abs(py - y)));
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ffd48a";
  ctx.fillRect(width - 54, 49, 45, 18);
  ctx.fillStyle = "#06100f";
  ctx.font = "900 10px Arial";
  ctx.fillText("0.4827", width - 49, 62);
}

function drawAll() {
  document.querySelectorAll(".ticker canvas").forEach((canvas) => {
    drawSparkline(canvas, canvas.dataset.line);
  });
  drawMarketChart();
}

window.addEventListener("resize", drawAll);
drawAll();
