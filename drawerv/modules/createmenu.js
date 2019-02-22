/* Active tab */
var tab = null;

/* A div marker being built */
var div;

/* A span marker being built */
var span;

/* A div marker as an image */
var image;

/* List of main tabs */
var maintabs = document.getElementById("maintabs");

/* List of buttons, tab by tab */
var buttons = document.getElementById("buttons");

/* List of tabs */
var lstTabs = [];

/*
  BRIEF Create a new button (icon and tooltip)
  PARAM bt Object to describe the new button with three fields :
    - name written in the tooltip
    - id to identify the new div marker
    - icon to find the button icon
  PARAM section Div where the new button is saved
*/
function createbutton(bt, section) {
  image = document.createElement("div");
  image.id = bt.id;
  image.classList.add("img");
  image.classList.add("button");
  image.style.backgroundImage = "url(\"" + bt.icon + "\")";
  span = document.createElement("span");
  span.classList.add("tooltip");
  span.innerText = bt.name;
  image.appendChild(span);
  section.appendChild(image);
}

/*
  BRIEF Create a new tab with buttons
  PARAM t Object to describe the new tab with three fields :
    - tab : name of this tab
    - icon to find the button icon
	- buttons : list of buttons for this tab
*/
function createtab(t) {;
  div = document.createElement("div");
  div.id = t.tab;
  div.classList.add("tab");

  div.addEventListener("click", function(ev) {
    change(t.tab);
  })

  image = document.createElement("div");
  image.classList.add("img");
  image.style.backgroundImage = "url(\"" + t.icon + "\")";
  div.appendChild(image);
  span = document.createElement("span");
  span.innerText = t.tab;
  lstTabs.push(t.tab);
  div.appendChild(span);
  maintabs.appendChild(div);
}

/*
  BRIEF Draw the main menu on the top of the header
  PARAM content File content parsed as a JSON object
*/
function mainmenu(content) {
  var lst;
  var tooltip;

  for (var k = 0; k < content.length; k ++) {
    createtab(content[k]);
    div = document.createElement("div");
    div.id = "tab-" + content[k].tab;
    div.classList.add("section");

    for (var b = 0; b < content[k].buttons.length; b ++) {
      createbutton(content[k].buttons[b], div);
    }

    buttons.appendChild(div);
  }

  activate("DrawErV");
  lst = document.getElementsByClassName("button");

  // Center the tooltip under the button
  for (var k = 0; k < lst.length; k ++) {
    tooltip = lst[k].children[0];
    tooltip.style.left = (lst[k].offsetLeft + 28 - tooltip.clientWidth/2) + "px";
  }
}

/*
  BRIEF Close the active tab and clear the button list
*/
function deactivate() {
  document.getElementById(tab).style.color = "";
  document.getElementById(tab).style.backgroundColor = "";
  document.getElementById("tab-" + tab).style.visibility = "";
  document.getElementById("tab-" + tab).style.height = "";
}

/*
  BRIEF Active a tab and fill the button list
  PARAM newtab Tab name to activate
*/
function activate(newtab) {
  tab = newtab;
  document.getElementById(tab).style.color = "rgb(25, 94, 192)";
  document.getElementById(tab).style.backgroundColor = "white";
  document.getElementById("tab-" + tab).style.visibility = "visible";
  document.getElementById("tab-" + tab).style.height = "100%";
}

/*
  BRIEF Change the active tab (close the former one and open the new one)
  PARAM newtab Name of the new active tab
*/
function change(newtab) {
  if (tab !== newtab) {
    deactivate();
    activate(newtab);
  }
}

function nextTab() {
  var k = lstTabs.indexOf(tab);

  if (k + 1 < lstTabs.length) {
    change(lstTabs[k + 1]);
  }
}

function previousTab() {
  var k = lstTabs.indexOf(tab);

  if (0 <= k - 1) {
    change(lstTabs[k - 1]);
  }
}
