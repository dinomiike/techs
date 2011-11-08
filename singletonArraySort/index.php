<?php
class Sorts {
	private static $instance;

	private function __construct() {
	}

	public static function create() {
		if (!isset(self::$instance)) {
			$className = __CLASS__;
			self::$instance = new $className;
		}
		return self::$instance;
	}

	public function arraySet($data, $columns, $direction, $option) {
		# If the field passed in is not an array, make it one
		if (!is_array($columns)) $columns = array($columns);

		# Send a closure to the usort function to handle an array of columns to sort on
		usort($data, function($a, $b) use($columns, $option) {
			$returnValue = 0;
			foreach ($columns as $column) {
				if ($returnValue == 0) {
					if ($option == "natural") {
						$returnValue = strnatcmp($a[$column], $b[$column]);
					} else {
						$returnValue = strcmp($a[$column], $b[$column]);
					}
				}
			}
			return $returnValue;
		});

		if ($direction == "desc") {
			return array_reverse($data);
		} else {
			return $data;
		}
	}

}

/*function arraySet($data, $columns, $direction, $option) {
	#$sortOption = function ($op, $field1, $field2) {
	#	if ($op == "natural") {
	#		return strnatcmp($field1, $field2);
	#	} else {
	#		return strcmp($field1, $field2);
	#	}
	#};

	# If the field passed in is not an array, make it one
	if (!is_array($columns)) $columns = array($columns);

	# Send a closure to the usort function to handle an array of columns to sort on
	usort($data, function($a, $b) use($columns, $option) {
		$returnValue = 0;
		foreach ($columns as $column) {
			#if ($returnValue == 0) $returnValue = strnatcmp($a[$fieldname], $b[$fieldname]);
			#if ($returnValue == 0) $returnValue = strcmp($a[$fieldname], $b[$fieldname]);
			#if ($returnValue == 0) $returnValue = $sortOption($type, $a[$fieldname], $b[$fieldname]);
			if ($returnValue == 0) {
				if ($option == "natural") {
					$returnValue = strnatcmp($a[$column], $b[$column]);
				} else {
					$returnValue = strcmp($a[$column], $b[$column]);
				}
			}
		}
		return $returnValue;
	});
	
	if ($direction == "desc") {
		return array_reverse($data);
	} else {
		return $data;
	}
	#return array_reverse($data);
	#return $data;
}*/

$data = array();
$data[] = array('id' => 1, 'number' => '0130', 'street' => 'Battery St', 'unit' => '1', 'rent' => 1200);
$data[] = array('id' => 10, 'number' => '130', 'street' => 'Battery St', 'unit' => '3', 'rent' => 1800);
$data[] = array('id' => 2, 'number' => '01049', 'street' => 'Leavenworth St', 'unit' => '11', 'rent' => 800);
$data[] = array('id' => 9, 'number' => '130', 'street' => 'Battery St', 'unit' => '10', 'rent' => 3400);
$data[] = array('id' => 7, 'number' => '1059', 'street' => 'Leavenworth St', 'unit' => '10', 'rent' => 1450);
$data[] = array('id' => 11, 'number' => '130', 'street' => 'Battery St', 'unit' => '5', 'rent' => 1000);

#arsort($data);
#$data = arraySet($data, array('street', 'id'), "desc", "natural");

$singleton = Sorts::create();
$data = $singleton->arraySet($data, array('street', 'id'), "asc", "natural");

#===============================================================================
# Output the array
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
