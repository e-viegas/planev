import * as bayes from "./bayes.js";


// main
var data = Array();
data.push(
  {"apriori": 0.73, "likelihood": 0.00042},
  {"apriori": 0.27, "likelihood": 0.77}
);

var res = core.bayes(data);
console.log(res);
