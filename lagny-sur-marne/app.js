/* Les variables */
var galerie = document.getElementsByClassName("photos") ;
var len = galerie.length ;
var map = L.map('map').setView([48.8577, 2.7055], 13) ;



/* Image précédente */
function previous(){
  galerie[pos].style.display = "none" ;
  pos -- ;
  if (pos < 0) pos = len - 1 ;
  galerie[pos].style.display = "flex" ;
}



/* Prochaine image */
function next(){
  galerie[pos].style.display = "none" ;
  pos ++ ;
  if (pos == len) pos = 0 ;
  galerie[pos].style.display = "flex" ;
}



/* Afficher la suite du texte */
function plus(idSuite, idSymPlus, idSymMoins){
  var suite = document.getElementById(idSuite) ;
  var symPlus = document.getElementById(idSymPlus) ;
  var symMoins = document.getElementById(idSymMoins) ;

  suite.style.display = "block" ;
  symPlus.style.display = "none" ;
  symMoins.style.display = "flex" ;
}



/* Cacher la suite du texte */
function moins(idSuite, idSymPlus, idSymMoins){
  var suite = document.getElementById(idSuite) ;
  var symPlus = document.getElementById(idSymPlus) ;
  var symMoins = document.getElementById(idSymMoins) ;

  suite.style.display = "none" ;
  symPlus.style.display = "flex" ;
  symMoins.style.display = "none" ;
}



/* Initialisation de la galerie */
pos = 0 ;
for (var k = 1 ; k < len ; k ++) galerie[k].style.display = "none" ;




/* La carte */
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{
  attribution : '&copy; <a href = "http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map) ;

L.marker([48.8777, 2.7055]).addTo(map)
    .bindPopup("Hôtel-de-Ville de Lagny-sur-Marne")
    .openPopup() ;

L.marker([48.8819, 2.7043]).addTo(map)
    .bindPopup("Gare de Lagny - Thorigny - Pomponne") ;

L.marker([48.855, 2.6971]).addTo(map)
    .bindPopup("Château de Guermantes") ;
