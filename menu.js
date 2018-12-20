var ajax = new XMLHttpRequest();
var menu;
var li;
var div1;
var div2;
var a;
var span;

ajax.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    results = JSON.parse(ajax.responseText).pages;
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
  }
};

// Send the AJAX query
ajax.open("GET", "getPages.php", true);
ajax.send();
