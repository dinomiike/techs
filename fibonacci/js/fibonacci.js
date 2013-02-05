"use strict";
var fib = function(num) {
  var series = [0, 1];
  if (num == 0 || num == 1) {
    return series[num];
  } else {
    for (var i = 2; i <= num; i++) {
      series.push(series[i-1] + series[i-2]);
    }
  }
  // Show the array for testing
  console.log(series);
  return series[num];
};
