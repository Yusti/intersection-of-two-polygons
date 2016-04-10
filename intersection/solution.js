// helpers
// intersection of two segments
function findIntersection(a1, a2, b1, b2) {
  // find line coeficients by 2 points Ax + By + C = 0
  var aA = a2.y - a1.y,
  aB = a1.x - a2.x,
  aC = a2.x * a1.y - a2.y * a1.x,
  bA = b2.y - b1.y,
  bB = b1.x - b2.x,
  bC = b2.x * b1.y - b2.y * b1.x;

  if (aA * bB != aB * bA) {
    var x = -(aC * bB - bC * aB) / (aA * bB - bA * aB),
    y = -(aA * bC - bA * aC) / (aA * bB - bA * aB);
    if (x >= Math.min(a1.x, a2.x) && x >= Math.min(b1.x, b2.x) && x <= Math.max(a1.x, a2.x) && x <= Math.max(b1.x, b2.x) && y >= Math.min(a1.y, a2.y) && y >= Math.min(b1.y, b2.y) && y <= Math.max(a1.y, a2.y) && y <= Math.max(b1.y, b2.y)) {
      return {x: x, y: y};
    }
  }
}
// intersection of segment with polygon
function segmentIntersections(a1, a2, polygon) {
  var results = [a1, a2],
    flag = true;
  for (var i = 0; i < polygon.length - 1; i++) {
    flag = true;
    var pointIntersection = findIntersection(a1, a2, polygon[i], polygon[i + 1]);
    if (pointIntersection) {
      for (var j = 0; j < results.length; j++) {
        if (results[j].x == pointIntersection.x && results[j].y == pointIntersection.y) {
          flag = false;
        }
      }
      if (flag) {
        results.push(pointIntersection);
      }
    }
  }
  var pointIntersectionLast = findIntersection(a1, a2, polygon[polygon.length - 1], polygon[0]);
  if (pointIntersectionLast) {
    flag = true;
    for (var k = 0; k < results.length; k++) {
      if (results[k].x == pointIntersectionLast.x && results[k].y == pointIntersectionLast.y) {
        flag = false;
      }
    }
    if (flag) {
      results.push(pointIntersectionLast);
    }
  }
  results = a1.x!=a2.x? results.sort(function(a, b){return a.x-b.x;}):results.sort(function(a, b){return a.y-b.y;});
  return results;
}

// will choose {-1, -1} as value outside the polygon
// find parts of segment inside polygon
function segmentsInside(a1, a2, polygon) {
  var minPoint = {x: -1, y: -1},
    allPointsOnSegment = segmentIntersections(a1, a2, polygon),
    results = [];
  for (var i = 0; i < allPointsOnSegment.length - 1; i++) {
    var averPoint = {x: (allPointsOnSegment[i].x + allPointsOnSegment[i + 1].x) / 2,
      y: (allPointsOnSegment[i].y + allPointsOnSegment[i + 1].y) / 2};
    var isInside = segmentIntersections(minPoint, averPoint, polygon).length % 2;
    if (isInside) {
      results.push({start: [allPointsOnSegment[i]], end: [allPointsOnSegment[i + 1]]});
    }
  }
  return results;
}

function intersects(fig1, fig2) {
  var results = [];
  for (var i = 0; i < fig1.length - 1; i++) {
    var someSegments = segmentsInside(fig1[i], fig1[i + 1], fig2);
    while (someSegments.length > 0) {
      results.push(someSegments[0]);
      someSegments.splice(0, 1);
    }
  }
  var someSegmentsLast = segmentsInside(fig1[fig1.length - 1], fig1[0], fig2);
  while (someSegmentsLast.length > 0) {
    results.push(someSegmentsLast[0]);
    someSegmentsLast.splice(0, 1);
  }
  for (var j = 0; j < fig2.length - 1; j++) {
    var someSegments2 = segmentsInside(fig2[j], fig2[j + 1], fig1);
    while (someSegments2.length > 0) {
      results.push(someSegments2[0]);
      someSegments2.splice(0, 1);
    }
  }
  var someSegmentsLast2 = segmentsInside(fig2[fig2.length - 1], fig2[0], fig1);
  while (someSegmentsLast2.length > 0) {
    results.push(someSegmentsLast2[0]);
    someSegmentsLast2.splice(0, 1);
  }


  var resultsReturn = [],
    p = 0;
  while (results.length > 0) {
    var finalResults = [];
    finalResults.push({x: results[0].start[0].x, y: results[0].start[0].y});
    finalResults.push({x: results[0].end[0].x, y: results[0].end[0].y});
    results.splice(0, 1);
    var flag = true;
    while (flag) {
      flag = false;
      for (var l = 0; l < results.length; l++) {
        if (finalResults[finalResults.length - 1].x == results[l].start[0].x && finalResults[finalResults.length - 1].y == results[l].start[0].y) {
          finalResults.push({x: results[l].end[0].x, y: results[l].end[0].y});
          flag = true;
          results.splice(l, 1);
          break;
        } else if (finalResults[finalResults.length - 1].x == results[l].end[0].x && finalResults[finalResults.length - 1].y == results[l].end[0].y) {
          finalResults.push({x: results[l].start[0].x, y: results[l].start[0].y});
          flag = true;
          results.splice(l, 1);
          break;
        }
      }
    }
    resultsReturn.push(finalResults);
    p++;
  }

  return resultsReturn;
}
