// Selected tab
var tab = "welcome";

// Temporary div element
var div = null;

// Selected caterogy inside the tab 'team'
var team = null;

// Temporary value
var tmp = null;

// Map to locate ENSG
var map = L.map("map").setView([48.841023, 2.587323], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Position of ENSG in geographic coordinates (reference system WGS84)
var ensg = L.marker([48.8406, 2.5872]).addTo(map);

/*
  BRIEF Open a tab. Nothing happened if the tab is already opened.
  PARAM val Name of this tab
*/
function openTab(val) {
  // Change the tab style in the nav toolbox
  div = document.getElementById("tab-" + val);
  div.style.backgroundColor = "white";
  div.style.color = "black";
  div.style.fontWeight = "bold";
  div.style.fontSize = "1.2em";

  // Change the tab icon
  // div = document.getElementById("icon-" + val);
  // div.style.backgroundImage = "url('resources/" + val + "-focused.png')";

  // Change the tab style in the wrap div
  div = document.getElementById("cont-" + val);
  div.style.visibility = "visible";
  div.style.height = "94%";
}

/*
  BRIEF Close a tab. Nothing happened if the tab is already closed.
  PARAM val Name of this tab
*/
function closeTab(val) {
  if (team != null) {
    tmp = team;
    team = null;
    closeTab(tmp);
  }

  // Change the tab style in the nav toolbox
  div = document.getElementById("tab-" + val);
  div.style.backgroundColor = "";
  div.style.color = "";
  div.style.fontWeight = "";
  div.style.fontSize = "";

  // Change the tab icon
  // div = document.getElementById("icon-" + val);
  // div.style.backgroundImage = "";

  // Change the tab style in the wrap div
  div = document.getElementById("cont-" + val);
  div.style.visibility = "";
  div.style.height = "";
}


// click on the tab button
/*
  BRIEF Event listener to open the tab "WELCOME"
*/
document.getElementById("tab-welcome").addEventListener("click", function() {
  closeTab(tab);
  tab = "welcome";
  openTab(tab);
})

/*
  BRIEF Event listener to open the tab "TEAM"
*/
document.getElementById("tab-team").addEventListener("click", function() {
  closeTab(tab);
  tab = "team";
  openTab(tab);
  team = "team-dir";
  openTab(team);
})

/*
  BRIEF Event listener to open the tab "CONSTRUCTION"
*/
document.getElementById("tab-const").addEventListener("click", function() {
  closeTab(tab);
  tab = "const";
  openTab(tab);
})

/*
  BRIEF Event listener to open the tab "STEERING"
*/
document.getElementById("tab-steering").addEventListener("click", function() {
  closeTab(tab);
  tab = "steering";
  openTab(tab);
})

/*
  BRIEF Event listener to open the tab "CONTACTS"
*/
document.getElementById("tab-contacts").addEventListener("click", function() {
  closeTab(tab);
  tab = "contacts";
  openTab(tab);
})

/*
  BRIEF Event listener to open the category "DIRECTION"
*/
document.getElementById("tab-team-dir").addEventListener("click", function() {
  closeTab(team);
  team = "team-dir";
  openTab(team);
})

/*
  BRIEF Event listener to open the category "STEERING"
*/
document.getElementById("tab-team-steer").addEventListener("click", function() {
  closeTab(team);
  team = "team-steer";
  openTab(team);
})

/*
  BRIEF Event listener to open the category "CONSTRUCTION"
*/
document.getElementById("tab-team-const").addEventListener("click", function() {
  closeTab(team);
  team = "team-const";
  openTab(team);
})

/*
  BRIEF Event listener to open the category "OTHER"
*/
document.getElementById("tab-team-other").addEventListener("click", function() {
  closeTab(team);
  team = "team-other";
  openTab(team);
})


// Initialisation on the tab "WELCOME"
openTab("welcome");
