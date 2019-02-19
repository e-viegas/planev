/* Variable to open a file */
var rawFile = new XMLHttpRequest();

// Process when the file is opened
rawFile.onreadystatechange = function (){
  if(rawFile.readyState === 4){
    if(rawFile.status === 200 || rawFile.status == 0){
      mainmenu(JSON.parse(rawFile.responseText));
      connect();
    }
  }
}

// Open the file
rawFile.open("GET", "menu.json", true);
rawFile.send(null);
