var param = window.location.hash;
var input = param.replace('#', '') || 15;
var canvasWidth = 800;
var canvasHeight = 800;
var radius = 500;//400;//340;
var cities;
var graph = {};
var selectOutput = '';

var save = '[{"city":8,"x":134,"y":123,"fromOrigin":181.89282558693733},{"city":7,"x":118,"y":430,"fromOrigin":445.896849058165},{"city":4,"x":45,"y":494,"fromOrigin":496.0453608290274},{"city":3,"x":500,"y":64,"fromOrigin":504.0793588315237},{"city":2,"x":452,"y":240,"fromOrigin":511.7655713312493},{"city":9,"x":615,"y":177,"fromOrigin":639.9640614909559},{"city":5,"x":240,"y":636,"fromOrigin":679.7764338368902},{"city":0,"x":127,"y":745,"fromOrigin":755.7473122677976},{"city":6,"x":760,"y":238,"fromOrigin":796.3943746662203},{"city":1,"x":648,"y":508,"fromOrigin":823.3881223335687}]';
var simple = '[{"city":0,"x":25,"y":300,"fromOrigin":301.0398644698074},{"city":1,"x":200,"y":100,"fromOrigin":223.60679774997897},{"city":2,"x":80,"y":600,"fromOrigin":605.3098380168623},{"city":3,"x":400,"y":320,"fromOrigin":512.2499389946279},{"city":4,"x":420,"y":620,"fromOrigin":748.8658090739622},{"city":5,"x":550,"y":100,"fromOrigin":559.0169943749474},{"city":6,"x":750,"y":400,"fromOrigin":960.4686356149273}]';

var Dijkstra = function() {
  this.nodes = {};
  this.startNode = {};
  this.endNode = {};
  this.currentNode = {};
  this.order = 1;
  this.shortest = {};
  this.path = [];

  this.plot = function(start, end) {
    // Set preliminary nodes
    this.startNode = start;
    this.endNode = end;
    this.currentNode = start;
    // Set up the start node as a permanent node, 0 distance away from itself
    this.addNode(start.city, this.order, 0);
    this.findPath();
    this.finished = false;
  };

  this.addNode = function(city, order, distance, working) {
    typeof(order) !== 'undefined' ? order = order : order = null;
    typeof(distance) !== 'undefined' ? distance = distance : distance = null;
    typeof(working) !== 'undefined' ? working = working : working = null;
    this.nodes[city] = {
      order: order,
      distance: distance,
      working: working
    };
  };

  this.traceBack = function() {
    var roads = this.currentNode.roads;
    // Base case:
    if (this.currentNode === this.startNode) {
      this.path = this.path.reverse();
      this.finished = true;
    } else {
      // 7. Loop through all the roads connected to the end point
      for (var i = 0; i < roads.length; i += 1) {
        if (!this.finished) {
          // 8. Find the road we took to get here: 
          // Is the total distance at the current node less the distance of the target city equal to the working distance of that city. If this is true, we came this way
          var targetCityWorkingValue = (this.nodes[roads[i][0]].working) ? parseFloat(this.nodes[roads[i][0]].working.toFixed(8)) : 0;
          var distanceToTargetCity = this.nodes[this.currentNode.city].distance - roads[i][1];
          if (distanceToTargetCity !== 0) {
            distanceToTargetCity = parseFloat(distanceToTargetCity.toFixed(8));
          }
          if (targetCityWorkingValue === distanceToTargetCity) {
            // Found the right path back. Save it to the storage
            this.path.push(roads[i][0]);
            // 9. Move to this city
            for (var j = 0; j < cities.length; j += 1) {
              if (parseInt(roads[i][0]) === cities[j].city) {
                this.currentNode = cities[j];
                break;
              }
            }
            // 10. Recurse
            this.traceBack();
          }
        }
      }
    }
  };

  this.findPath = function() {
    var city, distance, check;
    var roads = this.currentNode.roads;
    
    // Base case:
    if (this.currentNode === this.endNode) {
      // 6. Trace your path back to the start node by subtracting distances
      this.path.push(this.currentNode.city);
      this.traceBack();
    } else {

      // debugger;
      // 1. Create nodes for each road connecting to a city and assign temporary, working values. Only consider roads that haven't been given permanent labels.
      for (var i = 0; i < roads.length; i += 1) {
        city = roads[i][0];
        distance = roads[i][1];
        // Only assess this city if it doesn't have a permanent label
        check = this.nodes[city] && this.nodes[city].order;
        if (!check) {
          // Assign working labels to each dijkstra city node
          if (this.nodes[city]) {
            // If the cumulative distance on the current node + the distance down this road is less than the working value stored there, set it. If not do nothing
            if ((this.nodes[this.currentNode.city].working + distance) < this.nodes[city].working) {
              this.nodes[city].working += distance;
            }
          } else {
            // There was no node for this city so we create it and assign it the distance
            this.addNode(city, null, null, this.nodes[this.currentNode.city].distance + distance);
          }
        }
      }
      
      // 2. Loop all the dijkstra nodes that don't have permanent labels to find the one with the shortest distance
      for (var key in this.nodes) {
        // Only check nodes that don't have an order property (aka temporary labels)
        if (!this.nodes[key].order) {
          if (this.shortest.distance) {
            if (this.nodes[key].working < this.shortest.distance) {
              this.shortest.distance = this.nodes[key].working;
              this.shortest.city = key;
            }
          } else {
            this.shortest.distance = this.nodes[key].working;
            this.shortest.city = key
          }
        }
      }

      // 3. Assign a permanent label of distance to the node with the shortest distance
      this.nodes[this.shortest.city].order = this.order += 1;
      // Also assign the permanent distance
      this.nodes[this.shortest.city].distance += this.shortest.distance;

      // 4. Move to the new node (assign it to the current) and wipe away the values in shortest
      // TODO: Unfortunately this requires a loop through the cities array (again) because the data it's saved in is an array. A hash table might serve better
      for (var i = 0; i < cities.length; i += 1) {
        if (parseInt(this.shortest.city) === cities[i].city) {
          this.currentNode = cities[i];
          break;
        }
      }
      // Wipe shortest object
      this.shortest = {};

      // 5. Call findPath again. The new parameters have all been set -- see base case above for how the function should end
      this.findPath();
    }
  };

};

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
        // If the difference in distance from the origin to both points is <= to radius...
        if (Math.abs(cities[city].fromOrigin - cities[connectingCity].fromOrigin) <= radius) {
          // Calculate the actual distance between the two points
          var distance = Math.sqrt(
            Math.pow(
              (cities[connectingCity].x - cities[city].x), 2
            ) +
            Math.pow(
              (cities[connectingCity].y - cities[city].y), 2
            )
          );
          // If the actual distance is within radius then add it
          if (distance <= radius) {
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

// 1. Generate cities
// cities = generateCities(input);
// cities = JSON.parse(save);
cities = JSON.parse(simple);

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

// 4. Draw the graph using canvas
var canvas = document.getElementById('map-canvas');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var context = canvas.getContext('2d');
context.strokeStyle = 'rgba(0,0,0,0.3)';
for (var i = 0; i < cities.length; i += 1) {
  // Draw the square for the city
  context.fillRect(cities[i].x - 5, cities[i].y - 5, 10, 10);
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

  var description = '';//'<div>Starting from point ' + from + '</div>';

  // Clear out the output box
  document.getElementById('plotDetails').innerHTML = '';

  // Draw the highlight line by building a new object of the plot points
  // Need to grab the x,y coordinates of each point by looping through the cities array of objects
  // console.log('cities', cities);
  // for (var j = 0; j < cities.length; j += 1) {
  //   var city = cities[j].city;
  //   // Loop through the results array ensures we only do this gleaning once
  //   for (var k = 0; k < results.length; k += 1) {
  //     debugger;
  //     if (city === parseInt(results[k]) || from === parseInt(results[k])) {
  //       highlightLine[city] = {};
  //       highlightLine[city].x = cities[j].x;
  //       highlightLine[city].y = cities[j].y;
  //     }
  //   }
  // }
  // console.log('highlightLine',highlightLine);

  // var highlightCanvas = document.getElementById('map-highlight');
  // var highlightCanvasWidth = highlightCanvas.width;
  // var highlightCanvasHeight = highlightCanvas.height;
  // var highlightContext = highlightCanvas.getContext('2d');
  // var previousX = highlightLine[from].x;
  // var previousY = highlightLine[from].y;
  // console.log('from point',highlightLine[from]);
  // highlightContext.beginPath();
  // highlightContext.moveTo(highlightLine[from].x, highlightLine[from].y);
  // Describe the path
  for (var i = 0; i < results.length; i += 1) {
  //   highlightContext.beginPath();
  //   highlightContext.moveTo(previousX, previousY);
  //   highlightContext.lineTo(highlightLine[results[i]].x, highlightLine[results[i]].y);
  //   highlightContext.strokeStyle = 'rgba(231,60,69,0.9)';
  //   highlightContext.stroke();
    if (parseInt(results[i]) !== from) {
      description += '<div>Move to ' + results[i] + '</div>';
    }
  }
  // console.log(results);
  document.getElementById('plotDetails').innerHTML = description;

};

var el = document.getElementById('find');
el.addEventListener('click', handler, false);





var dj = new Dijkstra();
var start = cities[1];
var end = cities[6];
dj.plot(start, end);
























