// CUSTOM OPTIONS
let options = [
  "Lose",
  "$1000000",
  "Lose",
  "$350",
  "$5",
  "$99",
  "1 Burger",
  " 1 Glace",
];

const colors = [
  ["#fff", "#44201f"],
  ["#44201f", "#fff"],
  ["black", "#fff"],
];

let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;

let spinArcStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

let ctx;
const spinBtn = document.getElementById("spin");
const marker = document.querySelector(".marker");

spinBtn.addEventListener("click", spin);

// Drawing Wheel

function drawRouletteWheel() {
  const canvas = document.getElementById("canvas");
  window.devicePixelRatio = 2;
  const scale = window.devicePixelRatio;
  let size = 250;
  canvas.width = Math.floor(size * scale);
  canvas.height = Math.floor(size * scale);

  if (canvas.getContext) {
    const outsideRadius = 200;
    const textRadius = 160;
    const insideRadius = 0;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < options.length; i++) {
      const angle = startAngle + i * arc;
      const currentColor = i % colors.length;
      ctx.fillStyle = colors[currentColor][0];
      ctx.strokeStyle = "#44201f";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.fill();
      ctx.save();
      ctx.translate(
        255 + Math.cos(angle + arc / 2) * textRadius,
        255 + Math.sin(angle + arc / 2) * textRadius
      );
      ctx.rotate(angle + arc / 2 - 0.1);
      const text = options[i];

      ctx.font = "20px custom";
      ctx.scale(scale / 1.5, scale / 1.5);
      ctx.lineWidth = 1;
      ctx.textAlign = "center";
      ctx.strokeStyle = colors[currentColor][1];
      ctx.fillStyle = colors[currentColor][1];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }
  }
}

// Spin the wheel

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  spinBtn.disabled = true;
  rotateWheel();
}

// Rotate wheel
function rotateWheel() {
  spinTime += 7;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle =
    spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;
  const degrees = ((startAngle * 180) / Math.PI) % 360;

  options.map((el, index) => {
    const avrg = 360 / options.length;

    console.log(degrees);

    if (avrg * (index + 1) == Math.round(degrees)) {
      marker.classList.add("bounce");
      setTimeout(() => {
        marker.classList.remove("bounce");
      }, 100);
    }
  });

  drawRouletteWheel();
  spinTimeout = setTimeout("rotateWheel()", 10);
}

// Stop Wheel
function stopRotateWheel() {
  clearTimeout(spinTimeout);
  const degrees = (startAngle * 180) / Math.PI;
  const arcd = (arc * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  ctx.save();
  const text = options[index];
  alert(text);
  spinBtn.disabled = false;
  ctx.restore();
}

// Animation
function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();
