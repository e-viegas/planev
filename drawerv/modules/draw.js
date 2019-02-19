// ========= SWITCH =========
/*
  BRIEF : Stop an event allowing the user to draw on the canvas
*/
function endDraw() {
  if (op === "point") {
    /* Stop drawing points */
    endPoint();
  } else if (op === "polyline") {
    /* Stop drawing polylines */
    endPolyline();
  } else if (op === "polygon") {
    /* Stop drawing polygons */
    endPolygon();
  } else if (op === "triangle") {
    /* Stop drawing triangles */
    endTriangle();
  } else if (op === "regular") {
    endRegularPolygon();
  } else if (op === "circle") {
    endCircle();
  }
}


// ========= POINT =========
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
}

/*
  BRIEF : End the mod 'Point'
*/
function endPoint() {
  op = null;
  canvas.removeEventListener("click", point);
  document.getElementById("point").style.backgroundColor = "";
  document.getElementById("point").style.boxShadow = "";
}

/*
  BRIEF Called when the button 'POINT' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addPoint(ev) {
  if (op === "point") {
    endPoint();
  } else {
    // another active mod
    if (op !== null) {
      endDraw();
    }

    op = "point";
    document.getElementById("point").style.backgroundColor = "rgb(226, 226, 226)";
    document.getElementById("point").style.boxShadow = "0px 5px 5px rgb(173, 173, 173)";
    canvas.addEventListener("click", point);
  }
}


// ========= POLYLINE =========
/*
  BRIEF End a polyline, that is to say :
    - draw the last line segment
    - remove the events to allow the user to draw a polyline
*/
function endPolyline() {
  // empty polyline
  if (items[id].vertices.length === 0) {
    delete items[id];
  }

  op = null;
  id = null;
  canvas.removeEventListener("click", pushManually);
  document.getElementById("polyline").style.backgroundColor = "";
  document.getElementById("polyline").style.boxShadow = "";
}

/*
  BRIEF Called when the button 'POLYLINE' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addPolyline(ev) {
  if (op === "polyline") {
    endPolyline();
  } else {
    // another active mod
    if (op !== null) {
      endDraw();
    }

    // add a new polyline in the set 'items'
    items[index] = {
      geometry: "POLYLINE",
      vertices: Array()
    }

    // Keep the ID of the polyline and the operation name (op)
    id = index;
    index += 1;
    op = "polyline";

    // Add an event to draw a polyline
    document.getElementById("polyline").style.backgroundColor = "rgb(226, 226, 226)";
    document.getElementById("polyline").style.boxShadow = "0px 5px 5px rgb(173, 173, 173)";
    canvas.addEventListener("click", pushManually);
  }
}


// ========= POLYGON =========
/*
  BRIEF End a polygon, that is to say :
    - draw the last line segment (between the first and last nodes)
    - remove the events to allow the user to draw a polygon
*/
function endPolygon() {
  // empty polygon
  if (items[id].vertices.length === 0) {
    delete items[id];
  } else if (items[id].vertices.length < 3) {
    items[id].geometry = "POLYLINE";
  } else {
    // draw the last line segment
    drawline(
      items[items[id].vertices[0]],
      items[items[id].vertices[items[id].vertices.length - 1]],
      false
    );
  }

  // reset 'op' and 'id'
  op = null;
  id = null;

  // remove the event to draw a polygon
  canvas.removeEventListener("click", pushManually);
  document.getElementById("polygon").style.backgroundColor = "";
  document.getElementById("polygon").style.boxShadow = "";
}

/*
  BRIEF Called when the button 'POLYGON' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addPolygon(ev) {
  if (op === "polygon") {
    endPolygon();
  } else {
    // another active mod
    if (op !== null) {
      endDraw();
    }

    // add a new polygon in the set 'items'
    items[index] = {
      geometry: "POLYGON",
      vertices: Array()
    }

    // Keep the ID of the polygon and the operation name (op)
    id = index;
    index += 1;
    op = "polygon";

    // Add an event to draw a polygon
    document.getElementById("polygon").style.backgroundColor = "rgb(226, 226, 226)";
    document.getElementById("polygon").style.boxShadow = "0px 5px 5px rgb(173, 173, 173)";
    canvas.addEventListener("click", pushManually);
  }
}


// ========== TRIANGLE ==========
/*
  BRIEF End a triangle, that is to say :
    - draw the two last line segments (around the last node)
    - remove the events to allow the user to draw a triangle
*/
function endTriangle() {
  // triangle not finished
  if (items[id].vertices.length < 2) {
    delete items[id];
  } else if (items[id].vertices.length === 2) {
    items[id].geometry = "POLYLINE";
  }

  // remove the event
  id = null;
  op = null;
  document.getElementById("triangle").style.backgroundColor = "";
  document.getElementById("triangle").style.boxShadow = "";
  canvas.removeEventListener("click", pushPointIntoTriangle);
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
    var dx = items[items[id].vertices[1]].x - items[items[id].vertices[0]].x;
    var dy = items[items[id].vertices[1]].y - items[items[id].vertices[0]].y;

    // compute the third vertex
    length = Math.sqrt(dx ** 2 + dy ** 2);
    alpha = Math.atan2(dy, dx) - 2 * Math.PI/3;

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
    op = null;
    document.getElementById("triangle").style.backgroundColor = "";
    document.getElementById("triangle").style.boxShadow = "";
    canvas.removeEventListener("click", pushPointIntoTriangle);
  }
}

/*
  BRIEF Called when the button 'TRIANGLE' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addTriangle(ev) {
  if (op === "triangle") {
    endTriangle();
  } else {
    // another active mod
    if (op !== null) {
      endDraw();
    }

    // Add the triangle into the set 'items'
    items[index] = {
      geometry: "POLYGON",
      vertices: Array()
    }

    // Keep the ID of the polygon and the operation name (op)
    id = index;
    index += 1;
    op = "triangle";

    document.getElementById("triangle").style.backgroundColor = "rgb(226, 226, 226)";
    document.getElementById("triangle").style.boxShadow = "0px 5px 5px rgb(173, 173, 173)";
    canvas.addEventListener("click", pushPointIntoTriangle);
  }
}


// ========== REGULAR POLYGON ==========
/*
  BRIEF End a regular polygon, that is to say :
    - draw the last line segments
    - remove the events to allow the user to draw a reguar polygon
*/
function endRegularPolygon() {
  // regular polygon not finished
  if (items[id].vertices.length < 2) {
    delete items[id];
  } else if (items[id].vertices.length === 2) {
    items[id].geometry = "POLYLINE";
  }

  // remove the event
  id = null;
  op = null;
  document.getElementById("hexagon").style.backgroundColor = "";
  document.getElementById("hexagon").style.boxShadow = "";
  canvas.removeEventListener("click", pushPointIntoRegularPolygon);
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
    document.getElementById("number").value = "3";
    canvas.removeEventListener("click", pushPointIntoRegularPolygon);
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

  // remove the event
  endRegularPolygon();
  document.getElementById("regularpolygonpopup").style.visibility = "";
}

/*
  BRIEF Called when the button 'HEXAGON' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addRegularPolygon(ev) {
  if (op === "regular") {
    endRegularPolygon();
  } else {
    // another active mod
    if (op !== null) {
      endDraw();
    }

    // Add the regular polygon into the set 'items'
    items[index] = {
      geometry: "POLYGON",
      vertices: Array()
    }

    // Keep the ID of the polygon and the operation name (op)
    id = index;
    index += 1;
    op = "regular";

    document.getElementById("hexagon").style.backgroundColor = "rgb(226, 226, 226)";
    document.getElementById("hexagon").style.boxShadow = "0px 5px 5px rgb(173, 173, 173)";
    canvas.addEventListener("click", pushPointIntoRegularPolygon);
  }
}


// ========== CIRCLE ==========
/*
  BRIEF End a circle
    - Remove the circle if the radius is not chosen
    - Keep the center if it is selected
*/
function endCircle() {
  // Remove the last event
  if (items[id].center === null) {
    canvas.removeEventListener("click", chooseCenter);
  } else {
    canvas.removeEventListener("click", chooseRadius);
  }

  // no radius
  if (items[id].radius < 0) {
    delete items[id];
  }

  // reset variables
  id = null;
  op = null;
  document.getElementById("circle").style.backgroundColor = "";
  document.getElementById("circle").style.boxShadow = "";
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
  // choose color according to 'isselected'
  if (isselected) {
    ctx.strokeStyle = "rgb(0, 127, 14)";
  } else {
    ctx.strokeStyle = "rgb(0, 0, 0)";
  }

  // draw circle with the good color (isselected ?)
  ctx.beginPath();
  ctx.arc(
    items[circle.center].x + x0, items[circle.center].y + y0,
    circle.radius, 0, 2 * Math.PI, false
  );
  ctx.lineWidth = 1;
  ctx.stroke();
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
  endCircle();
}

/*
  BRIEF Called when the button 'CIRCLE' is clicked
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function addCircle(ev) {
  if (op === "circle") {
    endCircle();
  } else {
    // another active mod
    if (op !== null) {
      endDraw();
    }

    // Add the new circle in the set 'items'
    items[index] = {
      geometry: "CIRCLE",
      center: null,
      radius: -1
    }

    // Keep the ID of the polygon and the operation name (op)
    id = index;
    index += 1;
    op = "circle";

    document.getElementById("circle").style.backgroundColor = "rgb(226, 226, 226)";
    document.getElementById("circle").style.boxShadow = "0px 5px 5px rgb(173, 173, 173)";
    canvas.addEventListener("click", chooseCenter);
  }
}
