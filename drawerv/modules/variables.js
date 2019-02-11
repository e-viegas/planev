// Set of all items built in this canvas
var items = {};

// ID of the next item to build
var index = 0;

// Canvas, where the items are built
var canvas = document.getElementById("workbench");

// Context of this canvas
var ctx = canvas.getContext("2d");

// Canvas width
var width = canvas.width = canvas.clientWidth;

// Canvas height
var height = canvas.height = canvas.clientHeight;

// Absolute abscissa of the top-left canvas corner
var x0 = 0;

// Absolute ordinate of the top-left canvas corner
var y0 = 0;

// Temporary list of objects
var lst = Array();

// Key shift up or down ? Key control up or down ,
// shift down (true) => impossible to create new points with a polyline/polygon
var shift = false;
var ctrl = false;

// ID of the closest point to the current position
var closest;

// Maximal abscissa on the canvas
var maxx = 0;

// Maximal ordinate on the canvas
var maxy = 0;

// ID of current object
var id = null;

// Object to send AJAX request to a PHP server
var ajax = new XMLHttpRequest();

// Previous position of the canvas window
var moving = null;

// Selected items
var selected = Array();

// Name of the image
var name = "";

// Fill the canvas background
ctx.fillStyle = "rgb(255, 255, 153)";
ctx.fillRect(0, 0, width, height);
