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
  BRIEF End a polyline, that is to say :
    - draw the last line segment
    - remove the events to allow the user to draw a polyline
  PARAM ev Current event
*/
function endPolyline(ev) {
  // draw the last line segment
  ev.preventDefault();
  pushPoint(getMousePos(ev));
  id = null;

  // remove the events to allow the user to draw a polyline
  canvas.removeEventListener("contextmenu", endPolyline);
  canvas.removeEventListener("click", pushManually);
  document.getElementById("polyline").style.backgroundColor = "";
  document.getElementById("polyline").style.boxShadow = "";
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

/*
  BRIEF Called when the button 'POLYLINE' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addPolyline(ev) {
  // add a new item in the set 'items'
  items[index] = {
    geometry: "POLYLINE",
    vertices: Array()
  }

  id = index;
  index += 1;

  document.getElementById("polyline").style.backgroundColor = "rgb(226, 226, 226)";
  document.getElementById("polyline").style.boxShadow = "0px 5px 5px rgb(173, 173, 173)";
  canvas.addEventListener("contextmenu", endPolyline);
  canvas.addEventListener("click", pushManually);
}

/*
  BRIEF End a polygon, that is to say :
    - draw the two last line segment (around the last point selected by the user)
    - remove the events to allow the user to draw a polyline
  PARAM ev Current event
*/
function endPolygon(ev) {
  // draw the two last line segment (around the last point selected by the user)
  ev.preventDefault();
  pushPoint(getMousePos(ev));

  // draw the second last line segment
  if (items[id].vertices.length > 2) {
    drawline(
      items[items[id].vertices[0]],
      items[items[id].vertices[items[id].vertices.length - 1]],
      false
    );

    id = null;
  }

  // remove the events to allow the user to draw a polyline
  canvas.removeEventListener("contextmenu", endPolygon);
  canvas.removeEventListener("click", pushManually);
  document.getElementById("polygon").style.backgroundColor = "";
}

/*
  BRIEF Called when the button 'POLYGON' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addPolygon(ev) {
  // add a new item in the set 'items'
  items[index] = {
    geometry: "POLYGON",
    vertices: Array()
  }

  id = index;
  index += 1;

  document.getElementById("polygon").style.backgroundColor = "rgb(226, 226, 226)";
  canvas.addEventListener("contextmenu", endPolygon);
  canvas.addEventListener("click", pushManually);
}

/*
  BRIEF Push point into a triangle and build a triangle after the second point
  PARAM ev Current position to add
*/
function pushPointIntoTriangle(ev) {
  var length;
  var alpha;
  var pos;
  pushPoint(getMousePos(ev));

  // Build the triangle
  if (items[id].vertices.length == 2) {
    // compute the third vertex
    length = Math.sqrt(
      (items[items[id].vertices[1]].x - items[items[id].vertices[0]].x) ** 2 +
      (items[items[id].vertices[1]].y - items[items[id].vertices[0]].y) ** 2
    );
    alpha = Math.atan2(
      items[items[id].vertices[1]].y - items[items[id].vertices[0]].y,
      items[items[id].vertices[1]].x - items[items[id].vertices[0]].x
    ) - 2 * Math.PI/3;
    pos = {
      geometry: "POINT",
      x: items[items[id].vertices[1]].x + length * Math.cos(alpha),
      y: items[items[id].vertices[1]].y + length * Math.sin(alpha)
    }

    // Add the third vertex into the set 'items'
    items[index] = pos;
    items[id].vertices.push(index);
    index += 1;

    // Draw this vertex and the two last edges
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(pos.x + x0 - 1.5, pos.y + y0 - 1.5, 3, 3);
    updateMax(pos.x, pos.y);
    drawline(items[items[id].vertices[0]], items[items[id].vertices[2]], false);
    drawline(items[items[id].vertices[1]], items[items[id].vertices[2]], false);

    // remove the event
    id = null;
    document.getElementById("triangle").style.backgroundColor = "";
    canvas.removeEventListener("click", pushPointIntoTriangle);
  }
}

/*
  BRIEF Called when the button 'TRIANGLE' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addTriangle(ev) {
  // Add the triangle into the set 'items'
  items[index] = {
    geometry: "POLYGON",
    vertices: Array()
  }
  id = index;
  index += 1;

  document.getElementById("triangle").style.backgroundColor = "rgb(226, 226, 226)";
  canvas.addEventListener("click", pushPointIntoTriangle);
}

/*
  BRIEF Push point into a regular polygon
    and build a regular polygon after the second point
  PARAM ev Current position to add
*/
function pushPointIntoRegularPolygon(ev) {
  pushPoint(getMousePos(ev));

  // Build the regular polygon
  if (items[id].vertices.length == 2) {
    document.getElementById("regularpolygonpopup").style.visibility = "visible";
    document.getElementById("ok").addEventListener("click", buildRegularPolygon);
    document.getElementById("number").value = "3";
    document.getElementById("hexagon").style.backgroundColor = "";
    canvas.removeEventListener("click", pushPointIntoRegularPolygon);

    document.getElementById("cancel").addEventListener("click", function(ev){
      document.getElementById("hexagon").style.backgroundColor = "";
      document.getElementById("regularpolygonpopup").style.visibility = "";
      items[id].geometry = "POLYLINE";
      id = null;
    });
  }
}

/*
  BRIEF Build the regular polygon
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function buildRegularPolygon(ev) {
  var length;
  var alpha;
  var pos;
  var n = parseInt(document.getElementById("number").value);

  // Length and angular for the next vertices
  length = Math.sqrt(
    (items[items[id].vertices[1]].x - items[items[id].vertices[0]].x) ** 2 +
    (items[items[id].vertices[1]].y - items[items[id].vertices[0]].y) ** 2
  );
  alpha = Math.atan2(
    items[items[id].vertices[1]].y - items[items[id].vertices[0]].y,
    items[items[id].vertices[1]].x - items[items[id].vertices[0]].x
  );

  for (var k = 0; k < n - 2; k ++) {
    // compute the other vertices
    pos = {
      geometry: "POINT",
      x: items[items[id].vertices[k + 1]].x
        + length * Math.cos(alpha - 2 * (k + 1) * Math.PI/n),
      y: items[items[id].vertices[k + 1]].y
        + length * Math.sin(alpha - 2 * (k + 1) * Math.PI/n)
    }

    // Add the third vertex into the set 'items'
    items[index] = pos;
    items[id].vertices.push(index);
    index += 1;

    // Draw this vertex and an edge
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(pos.x + x0 - 1.5, pos.y + y0 - 1.5, 3, 3);
    drawline(items[items[id].vertices[k + 1]], items[items[id].vertices[k + 2]], false);
    updateMax(pos.x, pos.y);
  }

  ctx.fillStyle = "rgb(0, 0, 0)";
  drawline(items[items[id].vertices[0]], items[items[id].vertices[n - 1]], false);
  id = null;

  // remove the event
  document.getElementById("ok").removeEventListener("click", buildRegularPolygon);
  document.getElementById("regularpolygonpopup").style.visibility = "";
}

/*
  BRIEF Called when the button 'HEXAGON' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addRegularPolygon(ev) {
  items[index] = {geometry: "POLYGON", vertices: Array()}
  id = index;
  index += 1;
  document.getElementById("hexagon").style.backgroundColor = "rgb(226, 226, 226)";
  canvas.addEventListener("click", pushPointIntoRegularPolygon);
}

/*
  BRIEF Draw a circle on the canvas with a circle object
    This object must have at least two fields :
      - center : point with abscissa as x and ordinate as y
      - radius : Radius of this circle
  PARAM circle Oject to draw
  PARAM isselected Is the circle is selected ? (True/False)
*/
function drawCircle(circle, isselected) {
  if (isselected) {
    ctx.strokeStyle = "rgb(0, 127, 14)";
  } else {
    ctx.strokeStyle = "rgb(0, 0, 0)";
  }

  try {
    ctx.beginPath();
    ctx.arc(
      items[circle.center].x + x0, items[circle.center].y + y0,
      circle.radius, 0, 2 * Math.PI, false
    );
    ctx.lineWidth = 1;
    ctx.stroke();
  } catch (e) {}
}

/*
  BRIEF Choose the center of a circle
  PARAM ev Current event
*/
function chooseCenter(ev) {
  // add the center to the set 'items'
  var array = Array();
  items[index] = choosePosition(getMousePos(ev), array);
  items[id].center = array[0];

  // draw the center on the canvas
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(
    items[items[id].center].x + x0 - 1.5,
    items[items[id].center].y + y0 - 1.5,
    3, 3
  );

  // update the event listener
  canvas.removeEventListener("click", chooseCenter);
  canvas.addEventListener("click", chooseRadius);
}

/*
  BRIEF Choose the radius of a circle and add the new circle in the set 'items'
  PARAM ev Current event
*/
function chooseRadius(ev) {
  var array = Array();
  pos = choosePosition(getMousePos(ev), array);
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(pos.x + x0 - 1.5, pos.y + y0 - 1.5, 3, 3);

  // Compute the radius
  items[id].radius = Math.sqrt(
    (pos.x - items[items[id].center].x) ** 2 +
    (pos.y - items[items[id].center].y) ** 2
  );

  // Update the maximal coordinates
  updateMax(
    items[items[id].center].x + items[id].radius,
    items[items[id].center].y + items[id].radius
  );

  // Draw a circle
  drawCircle(items[id], false);
  id = null;

  // Remove the last event
  canvas.removeEventListener("click", chooseRadius);
  document.getElementById("circle").style.backgroundColor = "";
}

/*
  BRIEF Called when the button 'CIRCLE' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addCircle(ev) {
  // Add the new circle in the set 'items'
  items[index] = {
    geometry: "CIRCLE",
    center: null,
    radius: -1
  }
  id = index;
  index += 1;

  document.getElementById("circle").style.backgroundColor = "rgb(226, 226, 226)";
  canvas.addEventListener("click", chooseCenter);
}

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
  canvas.removeEventListener("click", select);
}

/*
  BRIEF Activate the cursor to select an object
  PARAM Current event (not usued)
*/
function cursor(ev) {
  document.getElementById("cursor").style.backgroundColor = "rgb(226, 226, 226)";
  canvas.addEventListener("click", select);
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
  // console.log({x0: x0, y0: y0});
}

function endMoving(ev) {
  moving = null;
  canvas.removeEventListener("mousemove", moveCanvas);
}

function connect() {
  window.onresize = resize;
  document.addEventListener("keydown", shiftdown);
  document.addEventListener("keyup", shiftup);
  document.getElementById("new").addEventListener("click", newfile);
  document.getElementById("export").addEventListener("click", exportCanvas);
  document.getElementById("import").addEventListener("click", importCanvas);
  document.getElementById("point").addEventListener("click", addPoint);
  document.getElementById("polyline").addEventListener("click", addPolyline);
  document.getElementById("polygon").addEventListener("click", addPolygon);
  document.getElementById("triangle").addEventListener("click", addTriangle);
  document.getElementById("hexagon").addEventListener("click", addRegularPolygon);
  document.getElementById("circle").addEventListener("click", addCircle);
  document.getElementById("cursor").addEventListener("click", cursor);
  document.getElementById("delete").addEventListener("click", clearCanvas);
  canvas.addEventListener("mousedown", beginMoving);
  canvas.addEventListener("mouseup", endMoving);
}
