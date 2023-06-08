var options = [
  "Lose",
  "$1000000",
  "Lose",
  "$350",
  "$5",
  "$99",
  "1 Burger",
  " 1 Glace",
];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function getColor(item) {
  if (item % 2) {
    return "#fff";
  } else {
    return "#44201f";
  }
}

function getFontColor(item) {
  if (item % 2) {
    return "#44201f";
  } else {
    return "#fff";
  }
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 0;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      ctx.fillStyle = getColor(i);
      ctx.strokeStyle = "#44201f";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();
      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(
        255 + Math.cos(angle + arc / 2) * textRadius,
        255 + Math.sin(angle + arc / 2) * textRadius
      );
      ctx.rotate(angle + arc / 2 - 0.1);
      var text = options[i];

      ctx.font = "20px sans-serif";
      ctx.lineWidth = 1;
      ctx.textAlign = "center";
      ctx.strokeStyle = getFontColor(i);
      ctx.fillStyle = getFontColor(i);
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);

      ctx.restore();
    }
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle =
    spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;

  const marker = document.querySelector(".arrow");

  var degrees = (startAngle * 180) / Math.PI;
  var arcd = (arc * 180) / Math.PI;
  var index = Math.floor((360 - (degrees % 360)) / arcd);

  [1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
    const avrg = 360 / options.length;

    if (Math.abs(avrg * (index + 1) - Math.round(degrees)) < 10) {
      marker.classList.add("bounce");
      setTimeout(() => {
        marker.classList.remove("bounce");
      }, 300);
    }
  });

  drawRouletteWheel();
  spinTimeout = setTimeout("rotateWheel()", 90);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = (startAngle * 180) / Math.PI;
  var arcd = (arc * 180) / Math.PI;
  var index = Math.floor((360 - (degrees % 360)) / arcd);
  ctx.save();
  var text = options[index];
  alert(text);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();
