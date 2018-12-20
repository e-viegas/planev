// Get the HTML canvas where the results are displayed
var canvas = document.querySelector("canvas");

// Get the context of this canvas to edit it
var ctx = canvas.getContext("2d");

// Change the dimension of this canvas
var width = canvas.width = 0.7 * window.innerWidth;
var height = canvas.height = 0.8 * window.innerHeight;

// Get the HTML DIVs to print the result values
var cd = document.getElementById("chooseDeg");
var rd = document.getElementById("res");

// Result table
var res;

// Initialise the data
// Dummy example
var data = Array();
data.push(
  {"apriori": 0.42, "likelihood": 0.73},
  {"apriori": 0.43, "likelihood": 0.12},
  {"apriori": 0.06, "likelihood": 0.77},
  {"apriori": 0.07, "likelihood": 0.97},
  {"apriori": 0.02, "likelihood": 0.07}
);


// ========== Model ==========
/* Calculate the plausibilities for each theories according to
   the likelihoods of the results */
function bayes(data) {
  var sum = 0;
  var results = Array();
  var temp;

  // P(x) is the sum of P(H_i) * P(x|H_i)
  for (var k = 0; k < data.length; k ++)
    sum += data[k].apriori * data[k].likelihood;

  // Bayes theorem : P(H|x) = P(x|H) * P(H)/P(x)
  // Calculate of logarithmic degree of plausibility
  for (var k = 0; k < data.length; k ++){
    temp = data[k].apriori * data[k].likelihood/sum;
    results.push({"plausibility": temp, "deg": deg(temp)});
  }

  return results;
}


function pow(x, n) {
  if (n == 0)
    return 1;
  else
    return x * pow(x, n - 1);
}


/* Calculate the degree of plausibility with a logarithmic scale */
function deg(val) {
    if (val <= 1/10) {
      // Count of "0"
      return Math.log10(val);
    } else if (val >= 9/10) {
      // Count of "9"
      return - Math.log10(1 - val);
    } else if (val < 0.5) {
      return - 4.125 * pow(val, 3) - 1.7125 * pow(val, 2) + 4.80625 * val - 1.459375;
    } else {
      return 4.125 * pow(1 - val, 3) + 1.7125 * pow(1 - val, 2) - 4.80625 * (1 - val) + 1.459375;
    }
}


// ========== View ==========
/* Reset the result section on the website
   Useful to print new results */
function reset() {
  var opt = document.createElement("option");
  opt.value = "";
  opt.innerHTML = "Choose an index ...";
  document.getElementById("chooseDeg").innerHTML = "";
  document.getElementById("chooseDeg").appendChild(opt);
  ctx.clearRect(0, 0, width, height);
  document.getElementById("res").innerHTML = "";
}


/* Print the value results for each theories */
function divval(num, results) {
  var deg = String(results.deg).split(".");
  var proba;
  var degFl = "";

  // Round the lowest and highest values
  if (results.plausibility < 0.0001)
    proba = "≈ 0";
  else if (results.plausibility > 0.9999)
    proba = "≈ 1";
  else
    // Round to 0.01
    proba = "= " + Math.round(10000 * results.plausibility)/100;

  // Round to 0.01
  if (deg.length > 1)
    degFl = "," + deg[1].slice(0, 2);
  else if (deg[0] == Infinity)
    deg[0] = "∞";
  else if (deg[0] == - Infinity)
    deg[0] = "- ∞";

  // Display the results
  rd.innerHTML = "<span>For H" + num + "</span><span><strong>"
    + deg[0] + "</strong>" + degFl + "</span><span>P " + proba
    + " %</span>";
}


/* Print a frame into the canvas */
function printFrame(x, y, w, h, r, g, b) {
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
}


/* Print a solid line into the canvas */
function solidLine(x1, y1, x2, y2) {
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}


/* Print a dotted line into the canvas */
function dottedLine(x1, y1, x2, y2) {
  var dltx = x2 - x1;
  var dlty = y2 - y1;
  var d = Math.sqrt(dltx * dltx + dlty * dlty);
  var xd = 2 * dltx/d;
  var yd = 2 * dlty/d;
  var n = Math.trunc(d/4);
  ctx.fillStyle = "rgb(0, 0, 0)";

  // Display of each small segment
  for (var k = 0; k < n; k += 2) {
    ctx.beginPath();
    ctx.moveTo(x1 + 2 * k * xd, y1 + 2 * k * yd);
    ctx.lineTo(x1 + 2 * (k + 1) * xd, y1 + 2 * (k + 1) * yd);
    ctx.stroke();
  }
}


/* Print the data and the results */
function print(data, res) {
  var xA = 0;
  var xAL = w;
  var xL = 2 * w;
  var xLP = 8 * w;
  var xP = 9 * w;
  var w = 0.1 * width;
  var lineAL = 0;
  var lineP = 0;
  var opt;
  ctx.fillStyle = "rgb(0, 0, 0)";

  // Display the basic structure
  printFrame(0, 0, width/10, height, 127, 127, 127);
  dottedLine(width/10, 0, width/5, 0);
  dottedLine(width/10, height, width/5, height);
  printFrame(width/5, 0, 3 * width/5, height, 127, 127, 127);
  dottedLine(4 * width/5, 0, 9 * width/10, 0);
  dottedLine(4 * width/5, height, 9 * width/10, height);
  printFrame(9 * width/10, 0, width/10, height, 127, 127, 127);

  // For each hypothesis
  for (var k = 0; k < data.length; k ++) {
    if (k != 0) {
      // Increase the ordinate
      lineAL += height * data[k - 1].apriori;
      lineP += height * res[k - 1].plausibility;

      // Daw some limits (solid and dotted lines)
      solidLine(0, lineAL, width/10, lineAL);
      dottedLine(width/10, lineAL, width/5, lineAL);
      solidLine(width/5, lineAL, 4 * width/5, lineAL);
      dottedLine(4 * width/5, lineAL, 9 * width/10, lineP);
      solidLine(9 * width/10, lineP, width, lineP);
    }

    // Draw the likelihood
    solidLine(
      (1 + 3 * data[k].likelihood) * width/5,
      lineAL,
      (1 + 3 * data[k].likelihood) * width/5,
      lineAL + height * data[k].apriori
    );

    // Create the dropdown list
    opt = document.createElement("option");
    opt.value = k;
    opt.innerHTML = "For H" + k;
    cd.appendChild(opt);
  }
}


// ========== Controller ==========
document.getElementById("chooseDeg").addEventListener("change", function(ev){
  var choice = cd.options[cd.selectedIndex].value;

  if (choice != "")
    divval(choice, res[choice]);
  else
    rd.innerHTML = "";
});


document.getElementById("add").addEventListener("click", function(ev){
  document.getElementById("addform").style.visibility = "visible";
  document.getElementById("addform").style.height = "auto";
  document.getElementById("number").value = 1;
  document.getElementById("reset").checked = false;
})


document.getElementById("okAdd").addEventListener("click", function(ev){
  nbr = document.getElementById("number").value;
  document.getElementById("addform").style.visibility = "hidden";

  if (document.getElementById("reset").checked) {
    data = [];

    for (var k = 0; k < nbr; k ++)
      data.push({"apriori": 1/nbr, "likelihood": 0.5});
  } else {
    for (var k = 0; k < nbr; k ++)
      data.push({"apriori": 0, "likelihood": 0.5});
  }

  res = bayes(data);
  reset();
  print(data, res);
})


document.getElementById("cancelAdd").addEventListener("click", function(ev){
  document.getElementById("addform").style.visibility = "";
  document.getElementById("addform").style.height = "";
})


document.getElementById("copy").addEventListener("click", function(ev){
  for (var k = 0; k < data.length; k ++)
    data[k].apriori = res[k].plausibility;

  res = bayes(data);
  reset();
  print(data, res);
})


function newcell(val, k, apriori) {
  var input = document.createElement("input");
  input.type = "text";
  input.value = val;
  input.classList.add("editval");

  if (apriori) {
    input.classList.add("apriori");
    input.addEventListener("change", function(ev){
      editapriori(input, k);
    });
  } else {
    input.addEventListener("change", function(ev){
      editlikelihood(input, k);
    });
  }

  return input;
}


function editlikelihood(item, k) {
  var val = parseFloat(item.value);

  if (isNaN(val) || val < 0 || val > 1) {
    item.value = data[k].likelihood;
  } else {
    data[k].likelihood = val;
    item.value = val;
  }
}


function editapriori(item, k) {
  var val = parseFloat(item.value);
  var sum = 0;
  var tab = document.getElementById("edittable");

  if (isNaN(val) || val < 0 || val > 1) {
    item.value = data[k].apriori;
  } else {
    data[k].apriori = val;
    item.value = val;

    for (var ind = 0; ind < data.length; ind ++) {
      if (data[ind].apriori < 1 - sum) {
        sum += data[ind].apriori;
      } else {
        data[ind].apriori = 1 - sum;
        sum = 1;
        tab.childNodes[ind].childNodes[0].value = Math.round(
          1000000 * data[ind].apriori
        )/1000000;
      }
    }

    data[data.length - 1].apriori += 1 - sum;
    tab.childNodes[data.length - 1].childNodes[0].value = Math.round(
      1000000 * data[data.length - 1].apriori
    )/1000000;
  }
}


document.getElementById("edit").addEventListener("click", function(ev){
  var tr;
  var th;

  document.getElementById("editform").style.visibility = "visible";
  document.getElementById("editform").style.height = "auto";
  document.getElementById("edittable").innerHTML = "";

  for (var k = 0; k < data.length; k ++) {
    tr = document.createElement("tr");
    tr.appendChild(newcell(data[k].apriori, k, true));
    tr.appendChild(newcell(data[k].likelihood, k, false));
    document.getElementById("edittable").appendChild(tr);
  }
})


document.getElementById("okEdit").addEventListener("click", function(ev){
  document.getElementById("editform").style.visibility = "";
  document.getElementById("editform").style.height = "";
  document.getElementById("edittable").innerHTML = "";
  res = bayes(data);
  reset();
  print(data, res);
})


// ========== main ==========
res = bayes(data);
reset();
print(data, res);
