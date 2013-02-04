(function(window, undefined) {
  "use strict";
  Number.prototype.primeFactorization = function() {
    if (this.isPrime()) {
      return "Prime Number!";
    } else {
      var quotient;
      var factorize = function(num) {
        for (var i = 2; i < num; i++) {
          // Look for a number that divides by the parameter evenly
          if (num % i == 0) {
            quotient = num / i;
            if (quotient.isPrime()) {
              // At this point, save prime and i as factors of the number
              return i+","+quotient; // end point
            } else {
              if (i.isPrime()) {
                // The parameter isn't a prime factor; save i and factor the quotient for primes
                return i+","+factorize(quotient); // recurse
              } else {
                // Neither i nor the quotient are prime, we need to factor them both for primes
                return factorize(i)+","+factorize(quotient); // recurse
              }
            }
          }
        }
        return "";
      };

      var output = factorize(this).split(",");
    
      console.log(output);

      return output.filter(function(prime) {
        if (parseInt(prime) != NaN) {
          // This is still returning the prime number as a string, not an int.
          // It doesn't sort correctly but it functions ok for now because of the commutative nature of mulitplication
          return parseInt(prime);
        }
      }).sort();
    }
  };
})(window);
