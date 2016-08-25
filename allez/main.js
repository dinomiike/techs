(function(window) {
  var checkbox = document.getElementById('check');

  checkbox.addEventListener('click', function() {
    var value = this.getAttribute('data-state');
    var box = checkbox.children[0];

    if (value === 'checked') {
      this.setAttribute('data-state', '');
      this.className = 'custom-checkbox';
      box.innerHTML = '';
    } else {
      this.setAttribute('data-state', 'checked');
      this.className = 'custom-checkbox checked';
      box.innerHTML = '×';
    }

  }, false);

})(window);