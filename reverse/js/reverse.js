// I prefer to use this[i] over this.charAt(i), but only as a personal preference.
// The only thing to note here is that you must define the result variable as an empty string.
// var result; will produce "undefined" as the existing item in the variable, the first time it's catenated.

(function(window, undefined) {
  "use strict";
  if (!String.prototype.reverse) {
    String.prototype.reverse = function() {
      var result = "", i = 0;
      for (; i < this.length; i++) {
        //console.log(i + ": " + this[i] + " - " + this[this.length - 1 - i]); //this[this.length - i]); // Evidence
        result += this[this.length - 1 - i];
      }
      return result;
    };
  } else {
    console.log("Ignoring new definition of reverse() in favor of a pre-existing implemention.");
  }
})(window);
