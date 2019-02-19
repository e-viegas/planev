/*
  BRIEF Update the minimal and maximal abscissas and ordinates
  PARAM x Abscissa of the new point
  PARAM y Ordinate of the new point
*/
function updateMax(x, y) {

  // Update the abscissa
  if (x > maxx) {
    maxx = x;
  }

  // Update the ordinate
  if (y > maxy) {
    maxy = y;
  }
}

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


// ========== POLYLINE/POLYGON ==========
/*
  BRIEF Draw a line segment on the canvas between two points
    A point must have at least two fields :
      - x : Abscissa
      - y : Ordinate
  PARAM pt1 First point of this line
  PARAM pt2 Last point of this line
  PARAM isselected Is this point selected (True/False)
*/
function drawline(pt1, pt2, isselected) {
  if (isselected) {
    ctx.strokeStyle = "rgb(0, 127, 14)";
  } else {
    ctx.strokeStyle = "rgb(0, 0, 0)";
  }

  ctx.beginPath();
  ctx.moveTo(pt1.x + x0, pt1.y + y0);
  ctx.lineTo(pt2.x + x0, pt2.y + y0);
  ctx.stroke();
}

/*
  BRIEF Add manually a point to a list (for polyline or polygon)
  PARAM ev Current event
*/
function pushManually(ev) {
  pushPoint(getMousePos(ev));
}

/*
  BRIEF Add a point to a list (for polyline or polygon) and draw a line segment
  PARAM pos Point to add. This object must have at least two fields :
    - x : Abscissa
    - y : Ordinate
*/
function pushPoint(pos) {
  var last;
  pos = choosePosition(pos, items[id].vertices);

  // draw the new point
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(pos.x + x0 - 1.5, pos.y + y0 - 1.5, 3, 3);
  updateMax(pos.x, pos.y);

  // draw a line segment if it is possible
  if (items[id].vertices.length > 1) {
    last = items[id].vertices.length - 2;
    drawline(items[items[id].vertices[last]], pos, false);
  }
}


// ========== RESIZE/DRAW ALL ==========
/*
  BRIEF Update the canvas when the browser window is resized
    - Resize the canvas according to the window size
    - Fill the canvas background
    - draw all items again according to set 'items'
*/
function resize() {
  // Get the new size
  width = canvas.width = canvas.clientWidth;
  height = canvas.height = canvas.clientHeight;

  // Fill canvas background
  ctx.fillStyle = "rgb(255, 255, 153)";
  ctx.fillRect(0, 0, width, height);

  // Draw all items
  drawall();
}

/*
  BRIEF Draw all items saved in the set 'items'
*/
function drawall() {
  var isselected;

  Object.keys(items).forEach(function (key) {
    if (selected.indexOf(parseInt(key)) === -1) {
      ctx.fillStyle = "rgb(0, 0, 0)";
      isselected = false;
    } else {
      ctx.fillStyle = "rgb(0, 127, 14)";
      isselected = true;
    }

    if (items[key].geometry === "POINT") {
      // draw points
      ctx.fillRect(items[key].x + x0 - 1.5, items[key].y + y0 - 1.5, 3, 3);
      updateMax(items[key].x, items[key].y);
    } else if (items[key].geometry === "POLYLINE"
        || items[key].geometry === "POLYGON") {
      // draw polylines or polygons
      for (var k = 1; k < items[key].vertices.length; k ++) {
        drawline(
          items[items[key].vertices[k - 1]],
          items[items[key].vertices[k]],
          isselected
        );
      }

      // draw the line segment between the first ant last points
      if (items[key].geometry === "POLYGON" && key != id && items[key].vertices.length > 2) {
        drawline(
          items[items[key].vertices[0]],
          items[items[key].vertices[items[key].vertices.length - 1]],
          isselected
        );
      }
    } else if (items[key].geometry === "CIRCLE") {
      // draw circles
      drawCircle(items[key], isselected);
    }
  });
}


// ========== Different options to select ==========
/*
  BRIEF Look for the closest point to the current position of the mouse
  PARAM pos Current position of the mouse as a point with two fields :
    - x : Abscissa
    - y : Ordinate
*/
function lookForClosestPoint(pos) {
  var mindist = Infinity;
  var sqrdist = null;
  closest = null;

  Object.keys(items).forEach(function (key) {
    if (items[key].geometry === "POINT") {
      // only with the points
      sqrdist = (items[key].x - pos.x) ** 2 + (items[key].y - pos.y) ** 2;

      // Update the minimal distance
      if (sqrdist < mindist) {
        mindist = sqrdist;
        closest = parseInt(key);
      }
    }
  })
}

/*
  BRIEF Choose the position between the current position and the closest point.
  PARAM pos Current position
  PARAM array Node list
*/
function choosePosition(pos, array) {
  // SHIFT => look for the closest point
  if (shift) {
    lookForClosestPoint(pos);

    // It exists a closest point to this position
    if (closest === null) {
      items[index] = pos;
      array.push(index);
      index += 1;
    } else {
      pos = items[closest];
      if (closest != lst[lst.length - 1]) {
        array.push(closest);
      }
    }
  } else {
    items[index] = pos;
    array.push(index);
    index += 1;
  }

  return {
    geometry: pos.geometry,
    x: pos.x,
    y: pos.y
  }
}

/*
  BRIEF Get the closest point on a line to a specified point
  PARAM ptM A point
  PARAM ptA First end point of the line segment
  PARAM ptB Last end point of the line segment
  RETURN Closest point to M on the line (AB)
*/
function pointline(ptM, ptA, ptB) {
  if (ptA.x === ptB.x) {
    return {geometry: "POINT", x: ptA.x, y: ptM.y};
  } else if (ptA.y === ptB.y) {
    return {geometry: "POINT", x: ptM.x, y: ptA.y};
  } else {
    var a = (ptB.y - ptA.y)/(ptB.x - ptA.x);
    var x = (ptM.x + a * (ptM.y - ptA.y) + (a ** 2) * ptA.x)/((a ** 2) + 1);
    var y = a * (x - ptA.x) + ptA.y;
    return {geometry: "POINT", x: x, y: y};
  }
}

/*
  BRIEF Look for the closest object to a position
  PARAM Current position of the mouse
*/
function lookForClosestObject(pos) {
  var mindist = Infinity;
  var sqrdist = null;
  var threshold = 16;
  var newposition = null
  closest = null;

  Object.keys(items).forEach(function (key) {
    if (items[key].geometry === "POINT") {
      // POINT
      sqrdist = (items[key].x - pos.x) ** 2 + (items[key].y - pos.y) ** 2;

      // Update the minimal distance
      if (sqrdist < threshold && sqrdist < mindist) {
        mindist = sqrdist;
        closest = parseInt(key);
      }
    } else if (items[key].geometry === "POLYLINE"
        || items[key].geometry === "POLYGON") {
      // POLYLINE or POLYGON
      for (var k = 1; k < items[key].vertices.length; k ++) {
        newposition = pointline(
          pos,
          items[items[key].vertices[k - 1]],
          items[items[key].vertices[k]]
        );

        sqrdist = (newposition.x - pos.x) ** 2
          + (newposition.y - pos.y) ** 2;

        // Update the minimal distance
        if (sqrdist < threshold && sqrdist < mindist) {
          mindist = sqrdist;
          closest = parseInt(key);
        }
      }
    } else if (items[key].geometry === "CIRCLE") {
      // CIRCLE
      sqrdist = (Math.sqrt(
        (items[items[key].center].x - pos.x) ** 2 +
        (items[items[key].center].y - pos.y) ** 2
      ) - items[key].radius) ** 2;

      // Update the minimal distance
      if (sqrdist < threshold && sqrdist < mindist) {
        mindist = sqrdist;
        closest = parseInt(key);
      }
    }
  });
}

/*
  BRIEF Look for the closest line or circle to a position
  PARAM Current position of the mouse
  RETURN Coordinates of the closest position to the mouse
*/
function lookForClosestLine(pos) {
  var mindist = Infinity;
  var sqrdist = null;
  var finalpos = null;

  Object.keys(items).forEach(function (key) {
    if (items[key].geometry === "POLYLINE"
        || items[key].geometry === "POLYGON") {
      // POLYLINE or POLYGON
      for (var k = 1; k < items[key].vertices.length; k ++) {
        newposition = pointline(
          pos,
          items[items[key].vertices[k - 1]],
          items[items[key].vertices[k]]
        );

        // Update the minimal distance
        if (sqrdist < mindist) {
          mindist = sqrdist;
          finalpos = newposition;
        }
      }
    } else if (items[key].geometry === "CIRCLE") {
      // CIRCLE
      sqrdist = (Math.sqrt(
        (items[items[key].center].x - pos.x) ** 2 +
        (items[items[key].center].y - pos.y) ** 2
      ) - items[key].radius) ** 2;

      // Update the minimal distance
      if (sqrdist < mindist) {
        mindist = sqrdist;
        finalpos = parseInt(key);
      }
    }
  });

  return finalpos;
}
