(function(window, undefined) {
  "use strict";
  if (!Number.prototype.primeFactorization) {
    Number.prototype.primeFactorization = function() {
      var input = this;
      var factors = new Array();
      for (var i = 2; i < input; i++) {
        if (input % i == 0) {
          factors.push(i);
        }
        //console.log(i+" % "+input+" = "+input % i);
      }
      console.log(factors);
    };
  };
})(window);
