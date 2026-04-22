<?php
$s = 'РџСЂРёРІРµС‚';
var_dump($s);
$a = iconv('UTF-8', 'Windows-1251//IGNORE', $s);
var_dump($a);
for ($i = 0; $i < strlen($a); $i++) { echo strtoupper(str_pad(dechex(ord($a[$i])), 2, '0', STR_PAD_LEFT)); }
echo PHP_EOL;
