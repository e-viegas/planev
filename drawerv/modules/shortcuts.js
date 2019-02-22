/*
  BRIEF Detect when the key 'SHIFT' or 'CTRL' is down
  PARAM ev Keyboard event
*/
function shiftdown(ev) {
  if (! shift && ev.key === "Shift") {
    shift = true;
  } else if (! shift && ev.key === "Control") {
    ctrl = true;
  }
}

/*
  BRIEF Detect when the key 'SHIFT' or 'CTRL' is up
  PARAM ev Keyboard event
*/
function shiftup(ev) {
  if (ev.key === "Shift") {
    shift = false;
  } else if (ev.key === "Control") {
    ctrl = false;
  }
}

/*
  BRIEF : Choose a function according to the shortcut
  PARAM ev Event when a key has been pushed
*/
function shortcut(ev) {
  if (ev.key === "n") {
    newfile(ev);
  } else if (ev.key === "s") {
    exportCanvas(ev);
  } else if (ev.key === "o") {
    importCanvas(ev);
  } else if (ev.key === "m") {
    addPoint(ev);
  } else if (ev.key === "l") {
    addPolyline(ev);
  } else if (ev.key === "p") {
    addPolygon(ev);
  } else if (ev.key === "t") {
    addTriangle(ev);
  } else if (ev.key === "r") {
    addRegularPolygon(ev);
  } else if (ev.key === "c") {
    addCircle(ev);
  } else if (ev.key === "k") {
    cursor(ev);
  } else if (ev.key === "Delete") {
    clearCanvas(ev);
  } else if (ev.key === "d") {
    deselectAll();
  } else if (ev.key === "a") {
    selectAll();
  } else if (ev.key === "ArrowRight") {
    nextTab();
  } else if (ev.key === "ArrowLeft") {
    previousTab();
  }
}
