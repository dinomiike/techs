(function() {
  'use strict';

  var root = this;

  /**
   * Interface for instantiating an animated counter
   *
   * @param {object} doc
   *   the reference of the document to use for accessing nodes in the page
   * @return {object} of public methods for the counter
   */
  function counterModule(doc) {
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
    var animationExperience;
    var CONSTANT_INTERVAL_TIME = 800;
    var ANIMATION_RATE = {
      VARIABLE: 'variable',
      CONSTANT: 'constant'
    };

    var defaults = {
      value: 0,
      inc: 1,
      pace: 1000,
      auto: true,
      decimals: 0,
      places: 0
    };

    /**
     * Calls the function that will do the work of animation, using the defined easing method
     *
     * @return {int} The setTimeout call returns an integer of the timeout id.
     */
    function animateValue() {
      if (counter.value === counter.stop) {
        _clearNext();
      }

      var interval = 0;

      if (animationExperience === ANIMATION_RATE.VARIABLE) {
        var range = counter.stop - counter.value;
        var duration = counter.duration;
        var easing = BezierEasing(0.21, 0.08, 0.95, 0.41);
        var iteration = 50 - (range);
        interval = (easing((iteration + 1) / 50) - easing(iteration / 50)) * duration;
      } else {
        interval = CONSTANT_INTERVAL_TIME;
      }

      return setTimeout(_doCount, interval);
    }

    /**
     * Initialize the counter. This starts the counter running and dictates which version of it should be displayed
     *
     * @param {string} elementContainerId
     *   The DOM ID of the element containing the counter
     * @param {object} options
     *   A map of options for initialization of this counter instance
     */
    function init(elementContainerId, options) {
      counter = options || {};

      // grab the user agent
      var agentParser = new UAParser();
      agentParser.getResult();
      counter.client = {};
      counter.client.browser = agentParser.getBrowser();

      var htmlElement = doc.getElementsByTagName('html')[0];
      var cssAnimationSupport = htmlElement.className.indexOf('no-csstransforms3d') < 0;
      var supportedBrowsers = [
        'chrome',
        'firefox',
        'safari',
        'mobile safari',
        'ie',
        'edge',
        'opera'
      ];
      var supportedBrowser;
      var browserName = counter.client.browser.name;
      var browserMajorVersion = parseInt(counter.client.browser.major, 10);

      // ensure this is a supported browser
      if (browserName && supportedBrowsers.indexOf(browserName.toLowerCase()) > -1) {
        switch (browserName) {
          case 'Chrome':
            if (browserMajorVersion >= 49) {
              supportedBrowser = true;
              animationExperience = ANIMATION_RATE.VARIABLE;
            } else if (browserMajorVersion > 30 || browserMajorVersion < 49) {
              supportedBrowser = true;
              animationExperience = ANIMATION_RATE.CONSTANT;
            } else {
              supportedBrowser = false;
            }
            break;

          case 'Firefox':
            if (browserMajorVersion >= 34) {
              supportedBrowser = true;
              animationExperience = ANIMATION_RATE.CONSTANT;
            } else {
              supportedBrowser = false;
            }
            break;

          case 'Safari':
            if (browserMajorVersion >= 6) {
              supportedBrowser = true;
              animationExperience = ANIMATION_RATE.VARIABLE;
            } else {
              supportedBrowser = true;
              animationExperience = ANIMATION_RATE.CONSTANT;
            }
            break;

          case 'Mobile Safari':
            if (browserMajorVersion >= 7) {
              supportedBrowser = true;
              animationExperience = ANIMATION_RATE.VARIABLE;
            } else if (browserMajorVersion >= 5 || browserMajorVersion < 7) {
              supportedBrowser = true;
              animationExperience = ANIMATION_RATE.CONSTANT;
            } else {
              supportedBrowser = false;
            }
            break;

          case 'IE':
            if (browserMajorVersion >= 10) {
              supportedBrowser = true;
              animationExperience = ANIMATION_RATE.CONSTANT;
            } else {
              supportedBrowser = false;
            }
            break;

          case 'Edge':
            supportedBrowser = true;
            animationExperience = ANIMATION_RATE.CONSTANT;
            break;

          case 'Opera':
            if (browserMajorVersion >= 30) {
              supportedBrowser = true;
              animationExperience = ANIMATION_RATE.VARIABLE;
            } else if (browserMajorVersion <= 20 || browserMajorVersion > 30) {
              supportedBrowser = true;
              animationExperience = ANIMATION_RATE. CONSTANT;
            } else {
              supportedBrowser = false;
            }
            break;

          default:
            supportedBrowser = false;
        }
      }

      for (var option in defaults) {
        if (defaults.hasOwnProperty(option)) {
          counter[option] = counter.hasOwnProperty(option) ? counter[option] : defaults[option];
        }
      }

      if (typeof elementContainerId === 'string') {
        elementContainer = doc.getElementById(elementContainerId);
      }

      if (cssAnimationSupport && supportedBrowser) {
        if (counter.auto) {
          // start the counter
          _doCount(true);
        } else {
          _renderSimplifiedCounter();
        }
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
     *
     * @return {object} instance of the counter
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
     *
     * @param {int} n
     *   the number the increment should be set to
     *
     * @return {object} instance of the counter
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
     *
     * @return {object} instance of the counter
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
     *
     * @return {object} instance of the counter
     */
    function setAuto(a) {
      var setAutoIncrement = typeof a === 'boolean' ? a : true;
      if (counter.auto) {
        if (!setAutoIncrement) {
          if (nextCount) {
            _clearNext();
          }
          counter.auto = false;
        }
      } else {
        if (setAutoIncrement && nextCount) {
          _clearNext();
        }
        counter.auto = true;
        _doCount();
      }

      return this;
    }

    /**
     * Sets the stop of the counter.
     *
     * @param {int} n
     *   the value the counter should stop at
     *
     * @return {object} instance of the counter
     */
    function setStop(n) {
      counter.stop = _isNumber(n) ? n : defaults.stop;
      return this;
    }

    /**
     * Increments counter by one animation based on set 'inc' value.
     *
     * @return {object} instance of the counter
     */
    function step() {
      if (!counter.auto) {
        _doCount();
      }

      return this;
    }

    /**
     * Adds a number to the counter value, not affecting the 'inc' or 'pace' of the counter.
     *
     * @param {int} n
     *   Number to add to counter value
     *
     * @return {object} instance of the counter
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
     *
     * @return {object} instance of the counter
     */
    function subtract(n) {
      if (_isNumber(n)) {
        x = counter.value;
        counter.value -= n;
        if (counter.value >= 0) {
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
     *
     * @return {int} the current value of the counter
     */
    function getValue() {
      return counter.value;
    }

    /**
     * Stops all running increments.
     *
     * @return {object} instance of the counter
     */
    function stop() {
      if (nextCount) {
        _clearNext();
      }

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

    // ---------------------------------------------------------------------------
    // Private methods

    /**
     * This is the function that does the "work" of the counter
     *
     * @param {boolean} first
     *   this will be true if it's the first time the function is called
     * @private
     */
    function _doCount(first) {
      var firstRun = typeof first === 'undefined' ? false : first;

      x = counter.value.toFixed(counter.decimals);

      if (!firstRun) {
        counter.value += counter.inc;
      }

      y = counter.value.toFixed(counter.decimals);

      _digitCheck(x, y);

      // do first animation
      if (counter.auto === true) {
        nextCount = animateValue();
      }
      // stop counter
      if (counter.value === counter.stop) {
        _clearNext();
      }
    }

    /**
     * Sets styled markup for the counter without any animation
     *
     * @private
     */
    function _renderSimplifiedCounter() {
      var counterValue = counter.hasOwnProperty('stop') === true ? counter.stop.toString() : counter.value.toString();
      var fixedDigitInput = counterValue;
      for (var digitIndex = counterValue.length; digitIndex < 6; digitIndex += 1) {
        fixedDigitInput = '0' + fixedDigitInput;
      }
      var digitMarkup = '';

      for (var i = fixedDigitInput.length - 1; i > -1; i -= 1) {
        digitMarkup += _counterDigitTemplate(i, fixedDigitInput[i], fixedDigitInput[i], 'simple');
      }

      elementContainer.innerHTML = digitMarkup;
    }

    /**
     * Checks for decimal places in the numbers to be rendered to the counter and calls the method to draw it
     *
     * @param {int} x
     *   the number behind the current counter tile
     * @param {int} y
     *   the number of the current counter tile
     * @private
     */
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
          digitsAnimate[i] = decimalsNew[i] !== decimalsOld[i];
        } else {
          var j = i - dlen;
          digitsAnimate[i] = digitsNew[j] !== digitsOld[j];
        }
      }

      _drawCounter();
    }

    /**
     * Creates array of digits for easier manipulation
     *
     * @param {int} input
     *   the number displayed across the whole counter; 750000, etc
     * @return {array} digits
     * @private
     */
    function _toArray(input) {
      var fixedDigitInput = input;
      for (var i = input.length; i < 6; i += 1) {
        fixedDigitInput = '0' + fixedDigitInput;
      }
      return fixedDigitInput.toString().split('').reverse();
    }

    /**
     * Creates and renders the counter markup to the supplied counter container element
     * @private
     */
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
          html = String(html);
        } else {
          html += '<li class="digit-delimiter">.</li>';
        }
      }

      var count = digitsNew.length;
      for (i; i < digitsAnimate.length; i++) {
        var j = i - (digitsAnimate.length - digitsNew.length);
        dNew = _isNumber(digitsNew[j]) ? digitsNew[j] : '';
        dOld = _isNumber(digitsOld[j]) ? digitsOld[j] : '';
        html += _counterDigitTemplate(i, dNew, dOld);

        if (counter.hasOwnProperty('hideDigitDelimiters') && counter.hideDigitDelimiters === true) {
          html = String(html);
        } else if (bit !== count && bit % 3 === 0) {
          html += '<li class="digit-delimiter">,</li>';
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
            a.className += ' animate';
          }
        }
      }, 20);
    }

    /**
     * The template for generating a digit
     *
     * @param {int} index
     *   the index of the digit in the counter
     * @param {string} newDigit
     *   the current number of the counter
     * @param {string} oldDigit
     *   the number behind the current number in the counter
     * @param {string} style
     *   pass 'simple' when rendering the non-animated version
     * @return {string}
     *   the markup needed to render a digit
     * @private
     */
    function _counterDigitTemplate(index, newDigit, oldDigit, style) {
      var result = '<li class="digit" id="' + elementContainer.id + '-digit-a' + index + '">' +
        '<div class="line"></div>' +
        '<span class="front">' + newDigit + '</span>' +
        '<span class="back">' + oldDigit + '</span>';
      if (style !== 'simple') {
        result += '<div class="hinge-wrap"><div class="hinge">' +
          '<span class="front">' + oldDigit + '</span>' +
          '<span class="back">' + newDigit + '</span>' +
          '</div></div>' +
          '</li>';
      }
      return result;
    }

    /**
     * Self explanatory
     *
     * @param {int} num
     *   number to check on
     * @return {boolean}
     *   seriously jsdoc?
     * @private
     */
    function _isNumber(num) {
      return !isNaN(parseFloat(num)) && isFinite(num);
    }

    /**
     * Removes the setTimeout instance of the ID assigned to nextCount
     *
     * @private
     */
    function _clearNext() {
      clearTimeout(nextCount);
      nextCount = null;
    }
  }

  root.counterModule = counterModule(root.document);
}).call(this);
