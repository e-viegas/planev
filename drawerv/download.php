<?php

$fname = "./files/" . $_GET["fname"];
$handle = fopen($fname, "w");
$result = fwrite($handle, $_GET["cont"]);
fclose($handle);
readfile($fname);

?>
