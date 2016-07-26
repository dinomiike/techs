(function() {
  'use strict';

  var root = this;

  var CounterModule = function(doc, undefined) {
    var counter;
    var elementContainer;
    var digitsOld = [];
    var digitsNew = [];
    var decimalsOld = [];
    var decimalsNew = [];
    var digitsAnimate = [];
    var x;
    var y;
    var lastTimeout;
    var nextCount = null;
    var htmlElement = doc.getElementsByTagName('html')[0];
    var cssAnimationSupport = htmlElement.className.indexOf('no-csstransforms3d') < 0;

    var defaults = {
      value: 0,
      inc: 1,
      pace: 1000,
      auto: true,
      decimals: 0,
      places: 0
    };

    function init(elementContainerId, options) {
      counter = options || {};

      var opt;
      for (opt in defaults) {
        counter[opt] = counter.hasOwnProperty(opt) ? counter[opt] : defaults[opt];
      }

      if (typeof(elementContainerId) === 'string') {
        elementContainer = doc.getElementById(elementContainerId);
      }

      if (cssAnimationSupport) {
        // start the counter
        _doCount(true);
      } else {
        _renderSimplifiedCounter();
      }
    }

    /**
     * Sets the value of the counter and animates the digits to new value.
     *
     * Example: counter.setValue(500); would set the value of the counter to 500,
     * no matter what value it was previously.
     *
     * @param {int} n
     *   New counter value
     */
    function setValue(n) {
      if (_isNumber(n)) {
        x = counter.value;
        y = counter.value = n;
        _digitCheck(x, y);
      }
      return this;
    }

    /**
     * Sets the increment for the counter. Does NOT animate digits.
     */
    function setIncrement(n) {
      counter.inc = _isNumber(n) ? n : defaults.inc;
      return this;
    }

    /**
     * Sets the pace of the counter. Only affects counter when auto == true.
     *
     * @param {int} n
     *   New pace for counter in milliseconds
     */
    function setPace(n) {
      counter.pace = _isNumber(n) ? n : defaults.pace;
      return this;
    }

    /**
     * Sets counter to auto-increment (true) or not (false).
     *
     * @param {boolean} a
     *   Should counter auto-increment, true or false
     */
    function setAuto(a) {
      var sa = typeof(a) !== 'boolean' ? true : a;
      if (counter.auto) {
        if (!sa) {
          if (nextCount) {
            _clearNext();
          }
          counter.auto = false;
        }
      } else {
        if (sa) {
          if (nextCount) {
            _clearNext();
          }
          counter.auto = true;
          _doCount();
        }
      }
      return this;
    }

    /**
     * Sets the stop of the counter.
     *
     * @param {int} n
     *
     */
    function setStop(n) {
      counter.stop = _isNumber(n) ? n : defaults.stop;
      return this;
    }

    /**
     * Increments counter by one animation based on set 'inc' value.
     */
    function step() {
      if (!counter.auto) _doCount();
      return this;
    }

    /**
     * Adds a number to the counter value, not affecting the 'inc' or 'pace' of the counter.
     *
     * @param {int} n
     *   Number to add to counter value
     */
    function add(n) {
      if (_isNumber(n)) {
        x = counter.value;
        counter.value += n;
        y = counter.value;
        _digitCheck(x, y);
      }
      return this;
    }

    /**
     * Subtracts a number from the counter value, not affecting the 'inc' or 'pace' of the counter.
     *
     * @param {int} n
     *   Number to subtract from counter value
     */
    function subtract(n) {
      if (_isNumber(n)) {
        x = counter.value;
        counter.value -= n;
        if (counter.value >= 0){
          y = counter.value;
        } else {
          y = '0';
          counter.value = 0;
        }
        _digitCheck(x, y);
      }
      return this;
    }

    /**
     * Gets current value of counter.
     */
    function getValue() {
      return counter.value;
    }

    /**
     * Stops all running increments.
     */
    function stop() {
      if (nextCount) _clearNext();
      return this;
    }

    return {
      init: init,
      setValue: setValue,
      getValue: getValue,
      setIncrement: setIncrement,
      setPace: setPace,
      setAuto: setAuto,
      setStop: setStop,
      step: step,
      add: add,
      subtract: subtract,
      stop: stop
    };

    /*---------------------------------------------------------------------------*/
    /**
     * Private methods
     */

    function _doCount(first) {
      var first_run = typeof(first) === 'undefined' ? false : first;

      x = counter.value.toFixed(counter.decimals);

      if (!first_run) {
        counter.value += counter.inc;
      }

      y = counter.value.toFixed(counter.decimals);

      _digitCheck(x, y);

      // do first animation
      if (counter.auto === true) {
        nextCount = setTimeout(_doCount, counter.pace);
      }
      // stop counter
      if (counter.value === counter.stop) {
        _clearNext();
      }
    }

    function _renderSimplifiedCounter() {
      var counterValue = counter.stop ? counter.stop.toString() : counter.value.toString();
      var i;
      var digitMarkup = '';

      for (i = counterValue.length - 1; i > -1; i -= 1) {
        digitMarkup += _counterDigitTemplate(i, counterValue[i], counterValue[i]);
      }

      elementContainer.innerHTML = digitMarkup;
    }

    function _digitCheck(x, y) {
      if (counter.decimals) {
        x = x.toString().split('.');
        y = y.toString().split('.');

        decimalsOld = _toArray(x[1]);
        decimalsNew = _toArray(y[1]);
        digitsOld = _toArray(x[0]);
        digitsNew = _toArray(y[0]);
      } else {
        digitsOld = _toArray(x);
        digitsNew = _toArray(y);
      }

      var ylen = digitsNew.length;
      var dlen = 0;

      if (counter.decimals) {
        ylen += decimalsNew.length;
        dlen = decimalsNew.length;
      }

      // reset to reset correctly all digit placeholder
      digitsAnimate = [];
      for (var i = 0; i < ylen; i++) {
        if (i < dlen) {
          digitsAnimate[i] = decimalsNew[i] != decimalsOld[i];
        } else {
          var j = i - dlen;
          digitsAnimate[i] = digitsNew[j] != digitsOld[j];
        }
      }

      _drawCounter();
    }

    // creates array of digits for easier manipulation
    function _toArray(input) {
      var output = input.toString().split('').reverse();
      if (counter.places > 0 && output.length < counter.places) {
        for (var i = output.length; i < counter.places; i++) {
          output.push('0');
        }
      }
      return output;
    }

    // sets the correct digits on load
    function _drawCounter() {
      var bit = 1;
      var html = '';
      var dNew;
      var dOld;

      var i = 0;
      if (counter.decimals) {
        for (i = 0; i < counter.decimals; i++) {
          dNew = _isNumber(decimalsNew[i]) ? decimalsNew[i] : '';
          dOld = _isNumber(decimalsOld[i]) ? decimalsOld[i] : '';
          html += _counterDigitTemplate(i, dNew, dOld);
        }

        if (counter.hasOwnProperty('hideDigitDelimiters') && counter.hideDigitDelimiters === true) {
          html += '';
        } else {
          html += '<li class="digit-delimiter">.</li>'
        }
      }

      var count = digitsNew.length;
      for (i; i < digitsAnimate.length; i++) {
        var j = i - (digitsAnimate.length - digitsNew.length);
        dNew = _isNumber(digitsNew[j]) ? digitsNew[j] : '';
        dOld = _isNumber(digitsOld[j]) ? digitsOld[j] : '';
        html += _counterDigitTemplate(i, dNew, dOld);

        if (counter.hasOwnProperty('hideDigitDelimiters') && counter.hideDigitDelimiters === true) {
          html += '';
        } else {
          if (bit !== count && bit % 3 === 0) {
            html += '<li class="digit-delimiter">,</li>';
          }
        }

        bit++;
      }

      elementContainer.innerHTML = html;

      var animateDigitLength = digitsAnimate.length;

      if (lastTimeout) {
        // reset timeout, so very fast setValue() calls work correctly without race conditions
        clearTimeout(lastTimeout);
        lastTimeout = null;
      }
      // need a slight delay before adding the 'animate' class or else animation won't fire on FF
      lastTimeout = setTimeout(function() {
        for (var i = 0; i < animateDigitLength; i++) {
          if (digitsAnimate[i]) {
            var a = doc.getElementById(elementContainer.id + '-digit-a' + i);
            a.className = a.className+' animate';
          }
        }
      }, 20);
    }

    function _counterDigitTemplate(index, newDigit, oldDigit) {
      return '<li class="digit" id="' + elementContainer.id + '-digit-a' + index + '">' +
        '<div class="line"></div>' +
        '<span class="front">' + newDigit + '</span>' +
        '<span class="back">' + oldDigit + '</span>' +
        '<div class="hinge-wrap"><div class="hinge">' +
        '<span class="front">' + oldDigit + '</span>' +
        '<span class="back">' + newDigit + '</span>' +
        '</div></div>' +
        '</li>';
    }

    function _isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function _clearNext() {
      clearTimeout(nextCount);
      nextCount = null;
    }
  };

  root.CounterModule = CounterModule(root.document);
}).call(this);
