<?php
$lambda = function($op, $p1, $p2) {
	if ($op == "plus") {
		return $p1 + $p2;
	} else {
		return $p1 - $p2;
	}
};

echo $lambda("minus", 2, 5);
