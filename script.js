const canvas = document.getElementById("productionChart");
const ctx = canvas.getContext("2d");
const fuelCanvas = document.getElementById("fuelTradeChart");
const fuelCtx = fuelCanvas.getContext("2d");

function drawProductionChart() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = rect.width;
  const height = rect.height;
  const pad = 26;
  const padT = 34;
  const chartW = width - pad * 1.4;
  const chartH = height - padT - pad * 1.05;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(216, 221, 224, 0.11)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i += 1) {
    const y = padT + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - 8, y);
    ctx.stroke();
  }

  for (let i = 0; i <= 5; i += 1) {
    const x = pad + (chartW / 5) * i;
    ctx.beginPath();
    ctx.moveTo(x, padT - 10);
    ctx.lineTo(x, height - pad);
    ctx.stroke();
  }

  const points = Array.from({ length: 96 }, (_, i) => {
    const trend = 1 - i / 120;
    const wave = Math.sin(i * 0.22) * 0.065 + Math.sin(i * 0.73) * 0.035;
    const jitter = ((i * 17) % 13) / 250;
    return Math.max(0.15, trend + wave + jitter);
  });

  ctx.beginPath();
  points.forEach((value, i) => {
    const x = pad + (chartW / (points.length - 1)) * i;
    const y = padT + chartH - value * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#d8dde0";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.lineTo(pad + chartW, height - pad);
  ctx.lineTo(pad, height - pad);
  ctx.closePath();
  const fill = ctx.createLinearGradient(0, 12, 0, height - pad);
  fill.addColorStop(0, "rgba(216, 221, 224, 0.2)");
  fill.addColorStop(1, "rgba(216, 221, 224, 0)");
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.fillStyle = "#7f8783";
  ctx.font = "10px Arial";
  ["1200", "800", "400", "0"].forEach((label, i) => {
    ctx.fillText(label, 0, padT + 4 + (chartH / 3) * i);
  });

  ctx.fillStyle = "#7f8783";
  ctx.font = "900 9px Arial";
  ctx.fillText("$FUEL OUTPUT PER DAY", pad, height - 7);
}

drawProductionChart();

function makeFuelCandles() {
  let last = 0.742;
  return Array.from({ length: 54 }, (_, i) => {
    const wave = Math.sin(i * 0.42) * 0.012 + Math.sin(i * 0.14) * 0.018;
    const drift = i > 28 ? 0.0038 : 0.0012;
    const open = last;
    const close = Math.max(0.67, open + wave + drift - ((i * 7) % 5) * 0.0024);
    const high = Math.max(open, close) + 0.012 + ((i * 11) % 7) * 0.0018;
    const low = Math.min(open, close) - 0.01 - ((i * 13) % 6) * 0.0016;
    const volume = 0.42 + ((i * 17) % 13) / 18 + Math.abs(close - open) * 9;
    last = close;
    return { open, high, low, close, volume };
  });
}

function drawFuelTradeChart() {
  const dpr = window.devicePixelRatio || 1;
  const rect = fuelCanvas.getBoundingClientRect();
  fuelCanvas.width = Math.floor(rect.width * dpr);
  fuelCanvas.height = Math.floor(rect.height * dpr);
  fuelCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = rect.width;
  const height = rect.height;
  const padL = 34;
  const padR = 74;
  const padT = 16;
  const padB = 30;
  const volH = 46;
  const chartH = height - padT - padB - volH;
  const chartW = width - padL - padR;
  const candles = makeFuelCandles();
  const min = Math.min(...candles.map((c) => c.low)) - 0.012;
  const max = Math.max(...candles.map((c) => c.high)) + 0.012;
  const volMax = Math.max(...candles.map((c) => c.volume));
  const slot = chartW / candles.length;
  const bodyW = Math.max(3, Math.min(8, slot * 0.52));

  const yFor = (price) => padT + ((max - price) / (max - min)) * chartH;
  const xFor = (i) => padL + slot * i + slot / 2;

  fuelCtx.clearRect(0, 0, width, height);
  fuelCtx.fillStyle = "rgba(5, 8, 8, 0.4)";
  fuelCtx.fillRect(0, 0, width, height);

  fuelCtx.strokeStyle = "rgba(216, 221, 224, 0.1)";
  fuelCtx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padT + (chartH / 4) * i;
    fuelCtx.beginPath();
    fuelCtx.moveTo(padL, y);
    fuelCtx.lineTo(width - padR, y);
    fuelCtx.stroke();
  }
  for (let i = 0; i <= 6; i += 1) {
    const x = padL + (chartW / 6) * i;
    fuelCtx.beginPath();
    fuelCtx.moveTo(x, padT);
    fuelCtx.lineTo(x, height - padB);
    fuelCtx.stroke();
  }

  candles.forEach((c, i) => {
    const x = xFor(i);
    const up = c.close >= c.open;
    const color = up ? "#6ed486" : "#ff3b30";
    const muted = up ? "rgba(110, 212, 134, 0.24)" : "rgba(255, 59, 48, 0.24)";
    const yHigh = yFor(c.high);
    const yLow = yFor(c.low);
    const yOpen = yFor(c.open);
    const yClose = yFor(c.close);
    const top = Math.min(yOpen, yClose);
    const bottom = Math.max(yOpen, yClose);
    const bodyH = Math.max(2, bottom - top);
    const volY = height - padB - (c.volume / volMax) * volH;

    fuelCtx.strokeStyle = color;
    fuelCtx.beginPath();
    fuelCtx.moveTo(x, yHigh);
    fuelCtx.lineTo(x, yLow);
    fuelCtx.stroke();

    fuelCtx.fillStyle = up ? "rgba(110, 212, 134, 0.82)" : "rgba(255, 59, 48, 0.82)";
    fuelCtx.fillRect(x - bodyW / 2, top, bodyW, bodyH);

    fuelCtx.fillStyle = muted;
    fuelCtx.fillRect(x - bodyW / 2, volY, bodyW, height - padB - volY);
  });

  const latest = candles[candles.length - 1].close;
  const latestY = yFor(latest);
  fuelCtx.strokeStyle = "rgba(255, 212, 123, 0.62)";
  fuelCtx.setLineDash([5, 5]);
  fuelCtx.beginPath();
  fuelCtx.moveTo(padL, latestY);
  fuelCtx.lineTo(width - padR, latestY);
  fuelCtx.stroke();
  fuelCtx.setLineDash([]);

  fuelCtx.fillStyle = "rgba(255, 212, 123, 0.14)";
  fuelCtx.fillRect(width - padR + 12, latestY - 10, 38, 20);
  fuelCtx.fillStyle = "#ffd47b";
  fuelCtx.font = "900 10px Arial";
  fuelCtx.fillText("$0.78", width - padR + 17, latestY + 4);

  fuelCtx.fillStyle = "#7f8783";
  fuelCtx.font = "10px Arial";
  [max, (max + min) / 2, min].forEach((value, i) => {
    fuelCtx.fillText(`$${value.toFixed(2)}`, width - padR + 14, padT + (chartH / 2) * i + 3);
  });
  ["09:00", "12:00", "15:00", "18:00"].forEach((label, i) => {
    fuelCtx.fillText(label, padL + (chartW / 3) * i - 8, height - 9);
  });
}

drawProductionChart();
drawFuelTradeChart();
window.addEventListener("resize", () => {
  drawProductionChart();
  drawFuelTradeChart();
});
