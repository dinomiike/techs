<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Content Editor Jr.</title>
  <link rel="stylesheet" type="text/css" href="css/normalize.css">
  <link href="http://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet" type="text/css">
  <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
  <div class="container">
    <div id="logo">
      <div class="heading">Content Editor</div>
      <div class="side">Jr.</div>
    </div>
    <div class="logoimg"></div>
    <div id="confirmation" class="hide">Ok! I have saved your updates!</div>
    <div id="console"></div>
    <button id="set">Set!</button>
  </div>
</body>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
<script type="text/javascript">
  (function (window, undefined) {
    "use strict";
    var prevColor = "", colorGroup = "", outfile = {}, winnersData = "", stringBuilder = "", color = "", i = 0;
    outfile.colors = {};

    //winnersData = $.getJSON("js/winners.json") // The old data file
    winnersData = $.getJSON("../sales.json")
    .success(function (data) {
      for (color in data.colors) {
        for (i = 0; i < data.colors[color].length; i++) {
          stringBuilder += "<div><input type='text' id='"+color+"_name_"+i+"' class='name "+color+"' value='"+data.colors[color][i].name+"'> "
            + "<input type='text' id='"+color+"_loc_"+i+"' class='"+color+"' value='"+data.colors[color][i].loc+"'></div>";
        }
      }
      document.getElementById("console").innerHTML = stringBuilder;
    })
    .error(function () {
      alert("error");
    });

    /*
    // The following function can be used to implement getElementsByClassName in IE6-8
    // jQuery already implements this so I'm using their version since jQuery is already implemented, but it's good to know!
    if (document.getElementsByClassName) {
      alert("we got those");
    } else {
      alert("we don't got those. so let's get 'em!");
      function getElementsByClassName(node, classname) {
        var a = [], i = 0, j = 0;
        var re = new RegExp('(^| )'+classname+'( |$)');
        var els = node.getElementsByTagName("*");
        for (i = 0, j = els.length; i < j; i++) {
          if (re.test(els[i].className))a.push(els[i]);
        }
        return a;
      }
    }
    */

    $("#set").on("click", function (event) {
      var inputs = $(".name"), inputLocElement = "", inputName = "", inputLoc = "", output = "", i = 0, jqxhr = "";
      for (i = 0; i < inputs.length; i++) {
        // Extract the color name from the id
        colorGroup = inputs[i].id.replace(/_.*/, "");
        if (colorGroup !== prevColor) {
          outfile.colors[colorGroup] = [];
          prevColor = colorGroup;
        }
        inputName = inputs[i].value;
        // Extract the ID number from the ID string
        inputLocElement = inputs[i].id.replace(/[^0-9]/g, "");
        inputLoc = document.getElementById(colorGroup+"_loc_"+inputLocElement).value;
        outfile.colors[colorGroup].push({"name": inputName, "loc": inputLoc});
      }
      output = JSON.stringify(outfile);

      jqxhr = $.ajax({
        dataType: "jsonp",
        mimeType: "application/x-javascript",
        url: "http://insite.breproperties.com/portal/sales500/?output="+output});
      if ($("#confirmation").prop("class") === "hide") {
        $("#confirmation").toggleClass("hide");
      }
    });
  })(window);
</script>
</html>
