<?php

$greet = function($name) {
	if ($name == "World") {
		printf("<b>Hello %s</b>\r\n", $name);
	} else {
		printf("Hello %s\r\n", $name);
	}
};

$greet("World");
$greet("PHP");*/


$sortFunction = function($order, $type) {
	switch ($type) {
		
	}

	if ($type == "natural") {
		printf("naturalSort(data)");
	} else {
		printf("normalSort(data)");
	}
};

$sortFunction("desc", "natural");
