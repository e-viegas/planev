//
var fr;

//
var file;


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
*/
function exportCanvas(ev) {
  endDraw();
  document.getElementById("exportpopup").style.visibility = "visible";
  document.getElementById("fname").value = name;
  document.getElementById("ext").value = "json";
}

/*
  BRIEF Export the figure on the canvas as a JSON text file
  PARAM fname Name of the file
*/
function exportJSON(fname) {
  var cont = {
    "origin": {"x": x0, "y": y0},
    "selected": selected,
    "zoom": zoom,
    "items": items
  };

  var blob = new Blob(
    [JSON.stringify(cont)],
    {type: "application/json;charset=utf-8"}
  );

  saveAs(blob, fname);
}

/*
  BRIEF Export the figure on the canvas as a SVG image
  PARAM filename Name of the file
*/
function exportSVG(fname) {
  var blob;
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

  // Download the file
  svg += "</svg>";
  blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
  saveAs(blob, fname);
}

/*
  /!\ to finish /!\
  /!\ Downloaded image is not readable /!\
*/
function exportPNG(fname) {
  var img = canvas.toDataURL("image/png");
  var blob = new Blob([img], {type: "image/png"});
  saveAs(blob, fname);
}


// ========= IMPORT =========
/*
  BRIEF Open and load file contents
*/
function handleFileSelect(){
  var input, type;

  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert("The File APIs are not fully supported in this browser.");
    return;
  }

  // Check if the file exists
  input = document.getElementById("fileinput");
  if (!input) {
    alert("It couldn't find the fileinput element.");
  } else if (!input.files || input.files[0] < 1) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  } else {
    // Read the file
    file = input.files[0];
    type = file.name.split(".")[1];

    if (type === "json" || type === "svg" || type === "png") {
      // Valid extension
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsText(file);
    } else {
      // Invalid extension
      alert("File refused because of its extension")
    }
  }
}

/*
  BRIEF Import the canvas according to the loaded contents
*/
function receivedText() {
  var type = file.name.split(".")[1];
  name = file.name.split(".")[0];
  // console.log(document.getElementById("save").checked);

  if (type === "svg") {
    importSVG(fr.result);
  } else if (type === "json") {
    importJSON(fr.result);
  } else {
    console.log("png");
  }
}

/*
  BRIEF Import a figure on the canvas with a SVG image or a JSON text file
  PARAM ev Current event (unused but mandatory for an event listener)
*/
function importCanvas(ev) {
  document.getElementById("importpopup").style.visibility = "visible";
  document.getElementById("fileinput").value = "";
  document.getElementById("save").checked = false;
  endDraw();
}

/*
  BRIEF Import a figure on the canvas with a JSON text file
  PARAM json Contents of JSON file
*/
function importJSON(json) {
  var temp = JSON.parse(json);

  // Fill the set 'items'
  Object.keys(temp.items).forEach(function (key) {
    items[parseInt(key)] = temp.items[key];
    index = parseInt(key) + 1;
  })

  // Set the variables and draw the items
  x0 = temp.origin.x;
  y0 = temp.origin.y;
  selected = temp.selected;
  zoom = temp.zoom;
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
function importPolyline(polylines) {
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
