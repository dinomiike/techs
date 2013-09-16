var input = 200;
var canvasWidth = 800;
var canvasHeight = 800;
var cities;

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
            // console.log('connecting to city...',cities[connectingCity].city, distance);
            connectRoad(cities[city], [cities[connectingCity].city, distance]);
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
cities = JSON.parse(save);

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

// 4. Build a graph based on the cities
var graph = new DirectedGraph();
graph.addNodesFromArray(cities);

// 5. Loop through all the roads in each city to draw edges










