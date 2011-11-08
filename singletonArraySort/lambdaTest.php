<?php
/*$lambda = function ($param) use ($first, $second) {
	if ($param == "echo") {
		return echo($first+", "+$second);
	} else {
		return var_dump($first);
	}
};*/

$lambda = function($op, $p1, $p2) {
	if ($op == "plus") {
		return $p1 + $p2;
	} else {
		return $p1 - $p2;
	}
};

echo $lambda("minus", 2, 5);
