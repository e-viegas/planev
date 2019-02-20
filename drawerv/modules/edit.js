// Object describing the current selection as a rectangle
var selection = {
  "xmin": null,
  "xmax": null,
  "ymin": null,
  "ymax": null,
  "built": false
}


// ========== DELETE ==========
/*


*/
function usedForShapes(idpoint) {
  var shape;
  var res = false;

  if (items[idpoint].geometry !== "POINT") {
    return false;
  }

  Object.keys(items).forEach(function (key) {
    shape = items[key];

    if (shape.geometry === "POLYLINE" || shape.geometry === "POLYGON") {
      if (shape.vertices.indexOf(parseInt(idpoint)) >= 0) {
        res = true;
      }
    } else if (shape.geometry === "CIRCLE") {
      if (shape.center === parseInt(idpoint)) {
        res = true;
      }
    }
  })

  return res;
}

/*
  BRIEF Clear the selected items from the canvas and the set 'items'
  PARAM ev Current event
*/
function clearCanvas(ev) {
  // Remove the selection from the set 'items'
  for (var k = 0; k < selected.length; k ++) {
    if (! usedForShapes(k)) {
      delete items[selected[k]];
    }
  }

  // clear the canvas and draw again
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgb(255, 255, 153)";
  ctx.fillRect(0, 0, width, height);
  selected.length = 0;
  maxx = 0;
  maxy = 0;
  drawall();
}


// ========== SELECT ==========
/*
  BRIEF Check if the selection contains a shape as a polyline or a polygon
  PARAM key ID of the polyline or the polygon
*/
function containsShape(key) {
  for (var k = 0; k < items[key].vertices.length; k++) {
    x = items[items[key].vertices[k]].x;
    y = items[items[key].vertices[k]].y;

    // One vertex out the box
    if (selection.xmin > x || x > selection.xmax
        || selection.ymin > y || y > selection.ymax) {
      return false;
    }
  }

  // Shape totally in the box
  return true;
}

/*
  BRIEF Push a new object into the current selection
    If the object is already selected, it will be deselected
  PARAM lst List of current selection (before be included into 'selected')
  PARAM key ID of the new object
*/
function pushObject(lst, key) {
  if (! ctrl && lst.indexOf(parseInt(key)) < 0) {
    lst.push(parseInt(key));
  } else if (ctrl && selected.indexOf(parseInt(key)) >= 0) {
    // deselect an item because it is already selected
    selected.splice(parseInt(key), 1);
  } else if (ctrl) {
    lst.push(parseInt(key));
  }
}

/*
  BRIEF Select all objects in a selection box
  Fill the list 'selected'
*/
function select() {
  var temp = [];
  var diag = (selection.xmax - selection.xmin) ** 2
    + (selection.ymax - selection.ymin) ** 2

  // Small selection => ponctual (diagonal² < 8)
  if (diag < 8) {
    // look for the closest item
    lookForClosestObject({
      "x": (selection.xmax + selection.xmin)/2,
      "y": (selection.ymax + selection.ymin)/2
    });

    // If the closest item exists ...
    if (closest !== null) {
      pushObject(temp, closest);
    }
  }

  // look for the items in the selection box
  Object.keys(items).forEach(function (key) {
    if (items[key].geometry === "POINT") {
      // POINT
      if (selection.xmin <= items[key].x && items[key].x <= selection.xmax
          && selection.ymin <= items[key].y && items[key].y <= selection.ymax) {
        pushObject(temp, key);
      }
    } else if (items[key].geometry === "POLYLINE"
        || items[key].geometry === "POLYGON") {
      // POLYLINE or POLYGON
      if (containsShape(key)) {
        pushObject(temp, key);
      }
    } else {
      // CIRCLE
      x = items[items[key].center].x;
      y = items[items[key].center].y;
      r = items[key].radius;

      if (selection.xmin <= x - r && x + r <= selection.xmax
          && selection.ymin <= y - r && y + r <= selection.ymax) {
        pushObject(temp, key);
      }
    }
  })

  // Add these items in 'selected'
  if (! ctrl) {
    selected = temp;
  } else {
    selected.push.apply(selected, temp);
  }

  // Draw again with the new selection
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgb(255, 255, 153)";
  ctx.fillRect(0, 0, width, height);
  maxx = 0;
  maxy = 0;
  drawall();
}

/*
  BRIEF Begin to select with a rectangle
  PARAM ev Events of mouse click with the coordinates
*/
function selectBox(ev) {
  var corner = getMousePos(ev);
  selection.xmin = corner.x;
  selection.xmax = corner.x;
  selection.ymin = corner.y;
  selection.ymax = corner.y;
  canvas.removeEventListener("mousedown", selectBox);
  canvas.addEventListener("mouseup", endBox);
}

/*
  BRIEF End to select with a rectangle
  PARAM ev Events of second mouse click with the coordinates
*/
function endBox(ev) {
  var corner = getMousePos(ev);
  selection.built = true;

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

  // Select and remove events
  select();
  endCursor();
}

/*
  BRIEF Stop the service 'cursor'
*/
function endCursor() {
  op = null;
  document.getElementById("cursor").style.backgroundColor = "";
  document.getElementById("cursor").style.boxShadow = "";
  canvas.removeEventListener("mouseup", endBox);
  canvas.addEventListener("mousedown", beginMoving);
  canvas.addEventListener("mouseup", endMoving);
}

/*
  BRIEF Activate/Stop the cursor to select some objects with a rectangle
  PARAM Current event (not usued)
*/
function cursor(ev) {
  if (op === "cursor") {
    endCursor();
  } else {
    // begin to select anything
    draw:endDraw();
    op = "cursor";
    selection.built = false;
    document.getElementById("cursor").style.backgroundColor = "rgb(226, 226, 226)";
    document.getElementById("cursor").style.boxShadow = "0px 5px 5px rgb(173, 173, 173)";
    canvas.addEventListener("mousedown", selectBox);
    canvas.removeEventListener("mousedown", beginMoving);
    canvas.removeEventListener("mouseup", endMoving);
  }
}

/*
  BRIEF Deselect all items selected
*/
function deselectAll() {
  selected.length = 0;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgb(255, 255, 153)";
  ctx.fillRect(0, 0, width, height);
  maxx = 0;
  maxy = 0;
  drawall();
}

/*
  BRIEF Select all items of the set 'items'
*/
function selectAll() {
  selected.length = 0;

  // select all items
  Object.keys(items).forEach(function (key) {
    selected.push(parseInt(key));
  })

  // draw again
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgb(255, 255, 153)";
  ctx.fillRect(0, 0, width, height);
  maxx = 0;
  maxy = 0;
  drawall();
}


// ========== MOVE ==========
/*
  BRIEF Add an event to move the canvas when the mouse is moving (mousemove)
  PARAM ev Event when the mouse begins to be clicked (mousedown)
*/
function beginMoving(ev) {
  moving = getMousePos(ev);
  canvas.addEventListener("mousemove", moveCanvas);
}

/*
BRIEF Move the canvas when the mouse is moving
PARAM ev Event with the current mouse coordinates on the screen (mousemove)
*/
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

/*
BRIEF Remove an event to move the canvas when the mouse is moving (mousemove)
PARAM ev Event when the mouse is up (mouseup)
*/
function endMoving(ev) {
  moving = null;
  canvas.removeEventListener("mousemove", moveCanvas);
}


// ========== ZOOM ==========
/*
  BRIEF Change the current zoom with the wheel
  PARAM ev Current event (wheel)
*/
function changeZoom(ev) {
  zoom += ev.deltaY/100;

  if (zoom < 0) {
    zoom = 0;
  } else if (zoom > 73) {
    zoom = 73;
  }

  console.log("zoom = " + 100 * zoom + "%");
}
