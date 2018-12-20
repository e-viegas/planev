var items = {};
var index = 0;
var canvas = document.getElementById("drawing");
var width = canvas.clientWidth;
var height = canvas.clientHeight;
var ww = canvas.width/width;
var hh = canvas.height/height;
console.log("w=" + width + " h=" + height);
console.log("w/w0=" + ww + " h/h0=" + hh);
var ctx = canvas.getContext("2d");

ctx.fillStyle = "rgb(255, 255, 153)";
ctx.fillRect(0, 0, width, height);


// ===== POINTS =====
function getMousePos(ev) {
  var rect = canvas.getBoundingClientRect();
  return {
    geometry: "POINT",
    x: ww * (ev.clientX - rect.left),
    y: hh * (ev.clientY - rect.top)
  };
}

function point(ev){
  items[index] = getMousePos(ev);
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.fillRect(
    items[index].x - 2.5 * ww,
    items[index].y - 2.5 * hh,
    5 * ww, 5 * hh
  );
  index += 1;
  canvas.removeEventListener("click", point);
}

function addPoint() {
  canvas.addEventListener("click", point);
}


// ===== POLYLINES =====
function addPolyline() {
  /* ??? */
}


// Event listeners
document.getElementById("point").addEventListener("click", function (ev) {
  addPoint();
})

document.getElementById("polyline").addEventListener("click", function (ev) {
  addPolyline();
})
