<?php

/*$greet = function($name) {
	if ($name == "World") {
		printf("<b>Hello %s</b>\r\n", $name);
	} else {
		printf("Hello %s\r\n", $name);
	}
};

$greet("World");
$greet("PHP");*/


/*$sortFunction = function($order, $type) {
	switch ($type) {
		
	}

	if ($type == "natural") {
		printf("naturalSort(data)");
	} else {
		printf("normalSort(data)");
	}
};

$sortFunction("desc", "natural");*/

$data = array();
$data[] = array('id' => 1, 'number' => '130', 'street' => 'Battery St', 'unit' => '1', 'rent' => 1200);
$data[] = array('id' => 1, 'number' => '130', 'street' => 'Battery St', 'unit' => '3', 'rent' => 1800);
$data[] = array('id' => 1, 'number' => '1049', 'street' => 'Leavenworth St', 'unit' => '11', 'rent' => 800);
$data[] = array('id' => 1, 'number' => '130', 'street' => 'Battery St', 'unit' => '10', 'rent' => 3400);
$data[] = array('id' => 1, 'number' => '1059', 'street' => 'Leavenworth St', 'unit' => '10', 'rent' => 1450);
$data[] = array('id' => 1, 'number' => '130', 'street' => 'Battery St', 'unit' => '5', 'rent' => 1000);

arsort($data);

$first = true;
$columns = "<tr>\n";
$output = "";

foreach ($data as $rows) {
	$output .= "<tr>\n";
	foreach ($rows as $column => $value) {
		if ($first) {
			$columns .= "<th>".$column."</th>\n";
		}
		$output .= "<td>".$value."</td>\n";
	}
	if ($first) {
		$first = false;
	}
	$output .= "</tr>\n";
}
$columns .= "</tr>";

$buildTable = "<table>\n".$columns."</tr>\n".$output."</table>\n";
echo $buildTable;
