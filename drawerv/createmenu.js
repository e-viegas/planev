var icons = [
  "import", "export", "point", "polyline", "polygon", "pentagon",
  "hexagon", "circle", "cursor", "edit", "move", "delete"
];
var nav = document.getElementById("nav");
var li;

// Create the navigation menu
for (var k = 0; k < icons.length; k ++) {
  li = document.createElement("li");
  li.classList.add("button");
  li.classList.add("img");
  li.id = icons[k];
  li.style.backgroundImage = "url(\"resources/" + icons[k] + ".png\")";
  nav.appendChild(li);
}
