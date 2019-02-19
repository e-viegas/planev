// Object describing the current selection as a rectangle
var selection = {
  "xmin": null,
  "xmax": null,
  "ymin": null,
  "ymax": null
}


/*
  BRIEF Clear the canvas and the set 'items'
*/
function clearCanvas(ev) {
  if (selected.length > 0) {
    // Remove the selected items
    for (var k = 0; k < selected.length; k ++) {
      delete items[selected[k]];
    }
  }

  // reset the set
  for (var prop in items) {
    if (items.hasOwnProperty(prop)) {
      delete items[prop];
    }
  }

  // clear the canvas
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgb(255, 255, 153)";
  ctx.fillRect(0, 0, width, height);
  maxx = 0;
  maxy = 0;

  if (selected.length > 0) {
    // Draw again the items when the selection is removed
    drawall();
    return;
  }
}

/*
  BRIEF Select an object by clicking
  PARAM Current position of the mouse
*/
function select(ev) {
  var k;
  lookForClosestObject(getMousePos(ev));

  if (closest !== null) {
    if (! ctrl) {
      selected.length = 0;
    }

    k = selected.indexOf(closest)
    if (k === -1) {
      selected.push(closest);
    } else {
      selected.splice(k, 1);
    }
  } else {
    selected.length = 0;
  }

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgb(255, 255, 153)";
  ctx.fillRect(0, 0, width, height);
  maxx = 0;
  maxy = 0;
  drawall();

  document.getElementById("cursor").style.backgroundColor = "";
  document.getElementById("cursor").style.boxShadow = "";
  canvas.removeEventListener("click", select);
}

function selectBox(ev) {
  var corner = getMousePos(ev);
  selection.xmin = corner.x;
  selection.xmax = corner.x;
  selection.ymin = corner.y;
  selection.ymax = corner.y;
  canvas.removeEventListener("mousedown", selectBox);
  canvas.addEventListener("mouseup", endBox);
}

function endBox(ev) {
  var corner = getMousePos(ev);

  // Put the abscissa
  if (corner.x < selection.xmin) {
    selection.xmin = corner.x;
  } else {
    selection.xmax = corner.x;
  }

  // Put the ordinate
  if (corner.y < selection.ymin) {
    selection.ymin = corner.y;
  } else {
    selection.ymax = corner.y;
  }

  console.log(selection);
  document.getElementById("cursor").style.backgroundColor = "";
  document.getElementById("cursor").style.boxShadow = "";
  canvas.removeEventListener("mouseup", endBox);
}

/*
  BRIEF Activate the cursor to select an object
  PARAM Current event (not usued)
*/
function cursor(ev) {
  draw:endDraw();
  document.getElementById("cursor").style.backgroundColor = "rgb(226, 226, 226)";
  document.getElementById("cursor").style.boxShadow = "0px 5px 5px rgb(173, 173, 173)";
  canvas.addEventListener("mousedown", selectBox);
}

function beginMoving(ev) {
  moving = getMousePos(ev);
  canvas.addEventListener("mousemove", moveCanvas);
}

function moveCanvas(ev) {
  var pos = getMousePos(ev);
  x0 += pos.x - moving.x;
  y0 += pos.y - moving.y;
  moving = pos;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgb(255, 255, 153)";
  ctx.fillRect(0, 0, width, height);
  maxx = 0;
  maxy = 0;
  drawall();
}

function endMoving(ev) {
  moving = null;
  canvas.removeEventListener("mousemove", moveCanvas);
}
