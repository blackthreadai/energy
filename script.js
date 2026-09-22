const canvas = document.getElementById("productionChart");
const ctx = canvas.getContext("2d");

function drawProductionChart() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = rect.width;
  const height = rect.height;
  const pad = 26;
  const chartW = width - pad * 1.4;
  const chartH = height - pad * 1.35;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(216, 221, 224, 0.11)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i += 1) {
    const y = pad + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - 8, y);
    ctx.stroke();
  }

  for (let i = 0; i <= 5; i += 1) {
    const x = pad + (chartW / 5) * i;
    ctx.beginPath();
    ctx.moveTo(x, 8);
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
    const y = 10 + chartH - value * chartH;
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
    ctx.fillText(label, 0, 14 + (chartH / 3) * i);
  });
  ["Feb 2026", "Jun 2026", "Oct 2026", "Feb 2027"].forEach((label, i) => {
    ctx.fillText(label, pad + (chartW / 3) * i - 10, height - 7);
  });
}

drawProductionChart();
window.addEventListener("resize", drawProductionChart);
