// ========= NEW FILE =========
/*
  BRIEF Reset the workbench to create a new image
  PARAM ev Current event
*/
function newfile(ev) {
  draw:endDraw();

  // reset the set 'items'
  for (var prop in items) {
    delete items[prop];
  }

  // reset the variables
  index = 0;
  x0 = 0;
  y0 = 0;
  name = "";
  maxx = 0;
  maxy = 0;
  id = null;
  moving = null;
  zoom = 1;

  // clear the canvas
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgb(255, 255, 153)";
  ctx.fillRect(0, 0, width, height);

  // reset the selection
  for (var k = 0; k < selected.length; k ++) {
    delete selected[k];
  }
}


// ========= EXPORT =========
/*
  BRIEF Export the figure on the canvas as a SVG image or a JSON text file
    An AJAX request on a PHP script is run
  PARAM ev Current event (unused but mandatory for an event listener)
  (à terminer)
*/
function exportCanvas(ev) {
  var fname;
  endDraw();
  document.getElementById("exportpopup").style.visibility = "visible";
  document.getElementById("fname").value = name;
  document.getElementById("ext").value = "json";

  // png
  /* context.clearRect(0, 0, width, height);
  var img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); //Convert image to 'octet-stream' (Just a download, really)
  window.location.href = img;*/
}

/*
  BRIEF Export the figure on the canvas as a JSON text file
  PARAM filename Name of the file
*/
function exportJSON(fname) {
  ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(ajax.responseText);
    }
  };

  var cont = {
    "origin": {"x": x0, "y": y0},
    "selected": selected,
    "zoom": zoom,
    "items": items
  };

  var url = "download.php?fname=" + fname
    + "&cont=" + JSON.stringify(cont);
  ajax.open("GET", url, true);
  ajax.send();
}

/*
  BRIEF Export the figure on the canvas as a SVG image
  PARAM filename Name of the file
*/
function exportSVG(fname) {
  // console.log(JSON.stringify(items));
  var svg = "<svg width=\"" + (maxx + 8) + "\" height=\"" + (maxy + 8) + "\">\n";

  Object.keys(items).forEach(function (key) {
    if (items[key].geometry === "POLYLINE"
        || items[key].geometry === "POLYGON") {
      // export a polyline or a polygon
      svg += "\t<" + items[key].geometry.toLowerCase() + " points=\"";

      // for each vertex
      for (var k = 0; k < items[key].vertices.length; k ++) {
        if (k !== 0) {
          svg += " ";
        }

        svg += items[items[key].vertices[k]].x + ","
          + items[items[key].vertices[k]].y;
      }

      svg += "\" style=\"fill:none;stroke:black;stroke-width:1\"/>\n";
    } else if (items[key].geometry === "CIRCLE") {
      // export a circle
      svg += "\t<circle cx=\"" + items[items[key].center].x
        + "\" cy=\"" + items[items[key].center].y
        + "\" r=\"" + items[key].radius + "\" stroke=\"black\" "
        + "stroke-width=\"1\" fill=\"none\"/>\n";
    }
  })

  svg += "</svg>";

  ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.open("./files/" + fname, "_blank");
      // remove the temporary file
    }
  };

  var url = "download.php?fname=" + fname + "&cont=" + svg;
  ajax.open("GET", url, true);
  ajax.send();
}


// ========= IMPORT =========
/*
  BRIEF Import a figure on the canvas with a SVG image or a JSON text file
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function importCanvas(ev) {
  type = "svg";
  endDraw();

  // contents = "{\"0\":{\"geometry\":\"POINT\",\"x\":260,\"y\":160.5}}";
  contents = "<svg width=\"291\" height=\"236.5\"><polygon "
    + "points=\"170,146.5 253,228.5 283,116\" "
    + "style=\"fill:none;stroke:black;stroke-width:1\"/></svg>"

  if (type === "svg") {
    importSVG(contents);
  } else {
    importJSON(contents);
  }
}

/*
  BRIEF Import a figure on the canvas with a JSON text file
  PARAM json Contents of JSON file
*/
function importJSON(json) {
  var temp = JSON.parse(json);

  Object.keys(temp).forEach(function (key) {
    items[index] = temp[key];
    index += 1;
  })

  drawall();
}

/*
  BRIEF Import a polygon list on the canvas with a SVG image
  PARAM polygons Polygon list to import
*/
function importPolygon(polygons) {
  var vertices = null;

  for (var k = 0; k < polygons.length; k ++) {
    // create an empty polygon
    items[index] = {
      geometry: "POLYGON",
      vertices: Array()
    };

    id = index;
    index += 1;
    vertices = polygons[k].attributes.points.nodeValue.split(" ");

    // add each vertex
    for (var k = 0; k < vertices.length; k ++) {
      items[index] = {
        geometry: "POINT",
        x: parseFloat(vertices[k].split(",")[0]),
        y: parseFloat(vertices[k].split(",")[1])
      }

      items[id].vertices.push(index);
      index += 1;
    }

    id = null;
  }
}

/*
  BRIEF Import a polyline list on the canvas with a SVG image
  PARAM polylines Polyline list to import
*/
function importPolylines(polylines) {
  var vertices = null;

  for (var k = 0; k < polylines.length; k ++) {
    // create an empty polyline
    items[index] = {
      geometry: "POLYLINE",
      vertices: Array()
    };

    id = index;
    index += 1;
    vertices = polylines[k].attributes.points.nodeValue.split(" ");

    // add each vertex
    for (var k = 0; k < vertices.length; k ++) {
      items[index] = {
        geometry: "POINT",
        x: parseFloat(vertices[k].split(",")[0]),
        y: parseFloat(vertices[k].split(",")[1])
      }

      items[id].vertices.push(index);
      index += 1;
    }

    id = null;
  }
}

/*
  BRIEF Import a figure on the canvas with a SVG image
  PARAM svg Contents of SVG file
*/
function importSVG(svg) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(svg, "text/xml");
  var polygons = xmlDoc.getElementsByTagName("polygon");
  var polylines = xmlDoc.getElementsByTagName("polyline");

  // import polygons
  importPolygon(polygons);

  // import polylines
  importPolyline(polylines);

  // update the canvas
  drawall();
}
