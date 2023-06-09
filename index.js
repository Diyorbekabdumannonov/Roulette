// CUSTOM OPTION
let options = [
  { value: "a", type: "img" },
  { value: "c", type: "img" },
  { value: "e", type: "img" },
  { value: "b", type: "img" },
  { value: "d", type: "img" },
  { value: "c", type: "img" },
  { value: "e", type: "img" },
  { value: "c", type: "img" },
];

// CUSTOM COLORS
const colors = [
  ["#8939d6", "#fff"],
  ["#017ec1", "#fff"],
  ["#19add9", "#fff"],
  ["#1b4db4", "#fff"],
];

let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;
let spinArcStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;
let ctx;
let loading = true;
const spinBtn = document.getElementById("spin");
const marker = document.querySelector(".marker");

spinBtn.addEventListener("click", spin);

window.onload = () => {
  drawRouletteWheel();
};

// Drawing Wheel

function drawRouletteWheel() {
  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const outsideRadius = 200;
    const textRadius = 160;
    const insideRadius = 0;
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < options.length; i++) {
      // Drawing piece of wheel
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
      ctx.rotate(angle + arc / 2 + 1.6);
      const item = options[i];

      // Adding wheel content
      const img = document.querySelector(`.${item.value}`);
      if (item.type == "img") {
        ctx.drawImage(img, -18, 0, 50, 50);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.font = "20px custom";
        ctx.lineWidth = 1;
        const text = options[i].value;
        ctx.textAlign = "center";
        ctx.strokeStyle = colors[currentColor][1];
        ctx.fillStyle = colors[currentColor][1];
        ctx.fillText(text, -ctx.measureText(item.value).width / 2, 0);
        ctx.restore();
      }
    }
    ctx.restore();
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
  var spinAngle =
    spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;

  const degrees = ((startAngle * 180) / Math.PI) % 360;

  options.map((el, index) => {
    const avrg = 360 / options.length;
    if (Math.abs(avrg * (index + 1) - Math.round(degrees)) < 10) {
      marker.classList.add("bounce");
      setTimeout(() => {
        marker.classList.remove("bounce");
      }, 200);
    }
  });
  drawRouletteWheel();
  spinTimeout = setTimeout("rotateWheel()", 10);
}

// Stop Wheel
function stopRotateWheel() {
  clearTimeout(spinTimeout);
  const degrees = (startAngle * 180) / Math.PI + 90;
  const arcd = (arc * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  ctx.save();
  const text = options[index].value;
  alert(`🏆🏆🏆 Your prize is ${text}.  🏆🏆🏆`);
  spinBtn.disabled = false;
  ctx.restore();
}

// Animation
function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}
