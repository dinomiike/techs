var input = 15;
var canvasWidth = 800;
var canvasHeight = 800;
var cities;
var graph = {};
var selectOutput = '';

var save = '[{"city":8,"x":134,"y":123,"fromOrigin":181.89282558693733},{"city":7,"x":118,"y":430,"fromOrigin":445.896849058165},{"city":4,"x":45,"y":494,"fromOrigin":496.0453608290274},{"city":3,"x":500,"y":64,"fromOrigin":504.0793588315237},{"city":2,"x":452,"y":240,"fromOrigin":511.7655713312493},{"city":9,"x":615,"y":177,"fromOrigin":639.9640614909559},{"city":5,"x":240,"y":636,"fromOrigin":679.7764338368902},{"city":0,"x":127,"y":745,"fromOrigin":755.7473122677976},{"city":6,"x":760,"y":238,"fromOrigin":796.3943746662203},{"city":1,"x":648,"y":508,"fromOrigin":823.3881223335687}]';

var generateCities = function(input) {
  var list = [];
  for (var i = 0; i < input; i += 1) {
    var city = {};
    city.city = i;
    city.x = Math.floor(Math.random() * canvasWidth) + 1;
    city.y = Math.floor(Math.random() * canvasHeight) + 1;
    city.fromOrigin = Math.sqrt(Math.pow((city.x - 0), 2) + Math.pow((city.y - 0),2));
    list.push(city);
    selectOutput += '<option id="' + city.city + '">' + city.city + '</option>';
  }
  return list;
};

var plotRoads = function(cities) {
  var allowBreak = false;
  var connectRoad = function(city, route) {
    city.roads ? city.roads.push(route) : city.roads = [route];
  };

  for (var city in cities) {
    // debugger;
    graph[cities[city].city] = {};
    for (var connectingCity in cities) {
      // Ensure we're not comparing the same city
      if (cities[city].city !== cities[connectingCity].city) {
        // If the difference in distance from the origin to both points is <= to 340...
        if (Math.abs(cities[city].fromOrigin - cities[connectingCity].fromOrigin) <= 340) {
          // Calculate the actual distance between the two points
          var distance = Math.sqrt(
            Math.pow(
              (cities[connectingCity].x - cities[city].x), 2
            ) +
            Math.pow(
              (cities[connectingCity].y - cities[city].y), 2
            )
          );
          // If the actual distance is within 340 then add it
          if (distance <= 340) {
            // Comparative option for testing
            connectRoad(cities[city], [cities[connectingCity].city, distance, cities[connectingCity].x, cities[connectingCity].y]);
            graph[cities[city].city][cities[connectingCity].city] = distance;
          }
        } else {
          // Only allow the flow to break out of the loop after you have passed this city in the array
          if (allowBreak) {
            break;
          }
        }
      } else {
        allowBreak = true;
      }
    }
    allowBreak = false;
  }
};

// var connectRoadEdges = function(cities) {
//   for (var i = 0; i < cities.length; i += 1) {
//     var roads = cities[i].roads;
//     if (roads.length > 1) {
//       for (var j = 0; j < roads.length; j += 1) {
//         // console.log(cities[i].city, cities[i].roads[j]);
//         // graph.addEdge(cities[i].city, cities[i].roads[j][0], cities[i].roads[j][1]);
//       }
//     }
//   }
// };

// 1. Generate cities
cities = generateCities(input);
// cities = JSON.parse(save);

// 2. Sort the cities array of objects by their distance from the origin
cities.sort(function(a, b) {
  var keyA = a.fromOrigin;
  var keyB = b.fromOrigin;
  if (keyA < keyB) return -1;
  if (keyA > keyB) return 1;
  return 0;
});

// 3. Plot roads (based on distance). This mutates the city objects embedded in cities
plotRoads(cities);
// console.log(cities);
// console.log(graph);

// 4. Draw the graph using canvas
var canvas = document.getElementById('map-canvas');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var context = canvas.getContext('2d');
context.strokeStyle = 'rgba(0,0,0,0.3)';
for (var i = 0; i < cities.length; i += 1) {
  // Draw the square for the city
  context.fillRect(cities[i].x, cities[i].y, 10, 10);
  // Draw a label for city number to identify them
  context.font = '20px Helvetica';
  context.fillText(cities[i].city, cities[i].x, cities[i].y - 5)
  // Draw a line to connect all the roads
  var roads = cities[i].roads;
  // TODO: There's an error where limiting the amount of data points can lead to no roads and canvas breaks
  // The better fix would be to increase the radius for connecting roads
  for (var j = 0; j < roads.length; j += 1) {
    context.beginPath();
    context.moveTo(cities[i].x, cities[i].y);
    context.lineTo(roads[j][2], roads[j][3]);
    context.stroke();
    context.font = '12px Helvetica';
    context.fillText(Math.floor(roads[j][1]), (roads[j][2] + cities[i].x) / 2, (roads[j][3] + cities[i].y) / 2);
  }
}

// 5. Populate the select options on the page with the pre-rendered output
document.getElementById('from').innerHTML = selectOutput;
document.getElementById('to').innerHTML = selectOutput;

// 6. HTML Event binding on the plot button
var handler = function() {
  var from = document.getElementById('from').selectedIndex || 0;
  var to = document.getElementById('to').selectedIndex;
  var results = dijkstra.find_path(graph, from, to);
  var highlightLine = [];

  var description = '<div>Starting from point ' + from + '</div>';

  // Clear out the output box
  document.getElementById('plotDetails').innerHTML = '';

  // Draw the highlight line by building a new object of the plot points
  // Need to grab the x,y coordinates of each point by looping through the cities array of objects
  for (var j = 0; j < cities.length; j += 1) {
    var city = cities[j].city;
    // Loop through the results array ensures we only do this gleaning once
    for (var k = 0; k < results.length; k += 1) {
      if (city === parseInt(results[k]) && from === parseInt(results[k])) {
        highlightLine[city] = {};
        highlightLine[city].x = cities[j].x;
        highlightLine[city].y = cities[j].y;
      }
    }
  }
  console.log('highlightLine',highlightLine);

  var highlightCanvas = document.getElementById('map-highlight');
  var highlightCanvasWidth = highlightCanvas.width;
  var highlightCanvasHeight = highlightCanvas.height;
  var highlightContext = highlightCanvas.getContext('2d');
  var previousX = highlightLine[from].x;
  var previousY = highlightLine[from].y;
  console.log('from point',highlightLine[from]);
  highlightContext.beginPath();
  highlightContext.moveTo(highlightLine[from].x, highlightLine[from].y);
  // Describe the path
  for (var i = 0; i < results.length; i += 1) {
    highlightContext.beginPath();
    highlightContext.moveTo(previousX, previousY);
    highlightContext.lineTo(highlightLine[results[i]].x, highlightLine[results[i]].y);
    highlightContext.strokeStyle = 'rgba(231,60,69,0.9)';
    highlightContext.stroke();
    description += '<div>Move to ' + results[i] + '</div>';
  }
  console.log(results);
  document.getElementById('plotDetails').innerHTML = description;

};

var el = document.getElementById('find');
el.addEventListener('click', handler, false);






























