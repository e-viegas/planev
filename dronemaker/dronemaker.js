var tab = "welcome";
var div = null;
var team = null;
var tmp = null;

// map
var map = L.map("map").setView([48.841023, 2.587323], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var ensg = L.marker([48.8406, 2.5872]).addTo(map);


// open or close a tab
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
document.getElementById("tab-welcome").addEventListener("click", function() {
  closeTab(tab);
  tab = "welcome";
  openTab(tab);
})


document.getElementById("tab-team").addEventListener("click", function() {
  closeTab(tab);
  tab = "team";
  openTab(tab);
  team = "team-dir";
  openTab(team);
})


document.getElementById("tab-const").addEventListener("click", function() {
  closeTab(tab);
  tab = "const";
  openTab(tab);
})


document.getElementById("tab-steering").addEventListener("click", function() {
  closeTab(tab);
  tab = "steering";
  openTab(tab);
})


document.getElementById("tab-contacts").addEventListener("click", function() {
  closeTab(tab);
  tab = "contacts";
  openTab(tab);
})



document.getElementById("tab-team-dir").addEventListener("click", function() {
  closeTab(team);
  team = "team-dir";
  openTab(team);
})


document.getElementById("tab-team-steer").addEventListener("click", function() {
  closeTab(team);
  team = "team-steer";
  openTab(team);
})


document.getElementById("tab-team-const").addEventListener("click", function() {
  closeTab(team);
  team = "team-const";
  openTab(team);
})


document.getElementById("tab-team-other").addEventListener("click", function() {
  closeTab(team);
  team = "team-other";
  openTab(team);
})


openTab("welcome");
