// ========= POINT =========
/*
  BRIEF Get the current position of the mouse on the canvas
  PARAM ev Current event
  RETURN point with these fields :
    - geometry : POINT (always this value)
    - x : Abscissa of current position
    - y : Ordinate of current position
*/
function getMousePos(ev) {
  var rect = canvas.getBoundingClientRect();
  return {
    geometry: "POINT",
    x: ev.clientX - rect.left - x0,
    y: ev.clientY - rect.top - y0
  };
}

/*
  BRIEF Build an isolated point, both on the canvas and in the set 'items'
  PARAM ev Current event
*/
function point(ev){
  items[index] = getMousePos(ev);
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(items[index].x + x0 - 1.5, items[index].y + y0 - 1.5, 3, 3);
  updateMax(items[index].x, items[index].y);
  index += 1;
  canvas.removeEventListener("click", point);
  document.getElementById("point").style.backgroundColor = "";
  document.getElementById("point").style.boxShadow = "";
}

/*
  BRIEF Called when the button 'POINT' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addPoint(ev) {
  document.getElementById("point").style.backgroundColor = "rgb(226, 226, 226)";
  document.getElementById("point").style.boxShadow = "0px 5px 5px rgb(173, 173, 173)";
  canvas.addEventListener("click", point);
}
