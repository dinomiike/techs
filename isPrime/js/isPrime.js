// Implementation of isPrime
// Returns true if the number is prime, otherwise returns false.

(function(window, undefined) {
  "use strict";
  // Check for an existing isPrime Number method
  if (!Number.prototype.isPrime) {
    Number.prototype.isPrime = function() {
      // Ensure the parameter is an integer
      var num = Math.round(this);
      for (var i = 2; i < this; i++) {
        if (this % i == 0) {
          return false;
        }
      }
      return true;
    }
  } else {
    console.log("The isPrime() already exists.");
  }
})(window);
