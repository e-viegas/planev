/*
  BRIEF Update the minimal and maximal abscissas and ordinates
  PARAM x Abscissa of the new point
  PARAM y Ordinate of the new point
*/
function updateMax(x, y) {

  // Update the abscissa
  if (x > maxx) {
    maxx = x;
  }

  // Update the ordinate
  if (y > maxy) {
    maxy = y;
  }
}
