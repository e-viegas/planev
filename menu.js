var ajax = new XMLHttpRequest();
var menu;
var li;
var div1;
var div2;
var a;
var span;

/*
  BRIEF : Open a text file and get the whole content
  PARAM : Path of the file to read
*/
function readTextFile(file){
  var rawFile = new XMLHttpRequest();

  // Process when the file is opened
  rawFile.onreadystatechange = function (){
    if(rawFile.readyState === 4){
      if(rawFile.status === 200 || rawFile.status == 0){
        createMenu(rawFile.responseText);
      }
    }
  }

  // Open the file
  rawFile.open("GET", file, true);
  rawFile.send(null);
}

/*
  BRIEF : Create a menu with a text
  PARAM : Text used to create this menu
*/
function createMenu(text) {
  // Parse the string and get the div element on the website for the menu
  results = JSON.parse(text).pages;
  menu = document.getElementById("menu");

  // Add each page into the menu
  for (var k = 0; k < results.length; k ++) {
    // Title and hypertext
    li = document.createElement("li");
    div1 = document.createElement("div");
    div1.classList.add("title");
    div2 = document.createElement("div");
    div2.classList.add("img");
    div2.classList.add("icon");

    // Add the image
    if (results[k].img === undefined) {
      div2.classList.add("list");
    } else {
      div2.style.backgroundImage = "url(\"" + results[k].img + "\")";
    }

    div2.style.marginLeft = "4px";
    div2.style.marginRight = "6px";
    div1.appendChild(div2);

    if (results[k].href === undefined) {
      // No hypertext
      span = document.createElement("span");
      span.innerHTML = results[k].title;
      div1.appendChild(span);
    } else {
      a = document.createElement("a");
      a.href = results[k].href;
      a.target = "_blank";
      a.innerHTML = results[k].title;
      div1.appendChild(a);
    }

    li.appendChild(div1);
    // Add the explanation
    div1 = document.createElement("div");
    div1.classList.add("more");
    span = document.createElement("span");
    span.innerHTML = results[k].explanation;
    div1.appendChild(span);
    li.appendChild(div1);
    menu.appendChild(li);
  }
};

// Create te menu
readTextFile("menu.json");
