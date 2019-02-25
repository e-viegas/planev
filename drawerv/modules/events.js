/*
  BRIEF : Connect all events to the website
*/
function connect() {
  window.onresize = resize;
  document.addEventListener("keydown", shiftdown);
  document.addEventListener("keydown", shortcut);
  document.addEventListener("keyup", shiftup);
  document.getElementById("new").addEventListener("click", newfile);
  document.getElementById("export").addEventListener("click", exportCanvas);
  document.getElementById("import").addEventListener("click", importCanvas);
  document.getElementById("help").addEventListener("click", help);
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
  canvas.addEventListener("wheel", changeZoom);
}

// Submit the form for the regular polygon
document.getElementById("ok").addEventListener("click", buildRegularPolygon);

// Cancel the form for the regular polygon
document.getElementById("cancel").addEventListener("click", function(ev){
  endRegularPolygon();
  document.getElementById("regularpolygonpopup").style.visibility = "hidden";
});

// Submit the form to export the canvas
document.getElementById("okExport").addEventListener("click", function() {
  document.getElementById("exportpopup").style.visibility = "hidden";
  name = document.getElementById("fname").value;
  type = document.getElementById("ext").value;
  fname = name + "." + type;

  // no name => no export
  if (name === "") {
    return;
  }

  // Export according to the type
  if (type === "svg") {
    exportSVG(htmlEntities(fname));
  } else if (type === "json") {
    exportJSON(htmlEntities(fname));
  } else {
    exportPNG(htmlEntities(fname));
  }
})

// Cancel the form to export the canvas
document.getElementById("cancelExport").addEventListener("click", function() {
  document.getElementById("exportpopup").style.visibility = "hidden";
})

// Submit the form to import the canvas
document.getElementById("okImport").addEventListener("click", function() {
  document.getElementById("importpopup").style.visibility = "hidden";
  handleFileSelect();
})

// Cancel the form to import the canvas
document.getElementById("cancelImport").addEventListener("click", function() {
  document.getElementById("importpopup").style.visibility = "hidden";
})

// Close the help in clicking out of the help box
document.getElementById("helppopup").addEventListener("click", function(ev) {
  if (ev.target.id === "helppopup") {
    // Outside
    document.getElementById("helppopup").style.visibility = "";
  }
})
