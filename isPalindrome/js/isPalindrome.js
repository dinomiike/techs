// TODO:
// Hook this up to the form
// Strip punctuation marks from the string
// Include (maybe by converting?) numbers

(function(window, undefined) {
  if (!String.prototype.isPalindrome) {
    String.prototype.isPalindrome = function() {
      var subject = this.replace(/\s/g, "").toLowerCase();
      console.log(subject);
      if (subject.length > 1) {
        for (var i = 0; i < Math.floor(subject.length / 2); i++) {
          if (subject.substring(i, subject.length - i).length > 1) {
            console.log(subject[i]);
            if (subject[i] != subject[(subject.length - i) - 1]) {
              return false;
            }
          } else {
            return false;
          }
        }
        return true;
      } else {
        return true;
      }
    };
  } else {
    console.log("The function \"isPalindrome\" has already been defined.");
  }
})(window);
