// Calculate the modulus of a vector
export function vectorLength(v: number[]): number {
  return Math.sqrt(v.reduce((sum, cur) => sum + cur ** 2, 0));
}

// Calculate the dot product of a vector
export function dotProduct(v1: number[], v2: number[]): number {
  return v1.reduce((sum, cur, index) => sum + cur * v2[index], 0);
}

// Calculate the angle of the vector
export function vectorAngle(v1: number[], v2: number[]): number {
  return Math.acos(dotProduct(v1, v2) / (vectorLength(v1) * vectorLength(v2)));
}

// Calculate the length of the other right angle side through the right angle side and the angle
export function computeSideLength(side: number, angle: number): number {
  return side / Math.tan(angle);
}

/**
 * Pass in the start point, end point and distance, and return the distance from the start point on the straight line as distance
 *
 * @param {[number, number]} [startX, startY]
 * @param {[number, number]} [endX, endY]
 * @param {number} distance
 * @returns
 * @memberof SvgPathGenerator
 */
export function radiusPoint(
  [startX, startY]: number[],
  [endX, endY]: number[],
  distance: number
) {
  // Calculate the straight-line distance between the end point and the starting point
  const dx = endX - startX;
  const dy = endY - startY;
  const totalDistance = Math.sqrt(dx * dx + dy * dy);

  // If the distance is greater than half of the total distance, take half
  if (distance > totalDistance / 2) {
    distance = totalDistance / 2;
  }

  // Calculate the ratio
  const ratio = distance / totalDistance;

  // Calculate the new point
  const x = startX + dx * ratio;
  const y = startY + dy * ratio;

  return [x, y];
}

// Pass in 2 vectors and fillet radius, and return the coordinates of the starting point of the fillet arc
export function radiusStartEndPoint(
  v1: number[],
  v2: number[],
  radius: number
) {
  // Calculate the vector angle
  const angle = vectorAngle(
    [v1[2] - v1[0], v1[3] - v1[1]],
    [v2[2] - v1[0], v2[3] - v1[1]]
  );

  // Calculate whether the three points are clockwise or counterclockwise
  const sweepFlag =
    (v1[2] - v1[0]) * (v2[3] - v1[1]) - (v1[3] - v1[1]) * (v2[2] - v1[0]) < 0
      ? 1
      : 0;

  // Calculate the length of half the short side
  const maxLength = Math.min(
    vectorLength([v1[2] - v1[0], v1[3] - v1[1]]) / 2,
    vectorLength([v2[2] - v1[0], v2[3] - v1[1]]) / 2
  );

  // Calculate the maximum value of radius
  const maxRadius = Math.min(radius, maxLength * Math.tan(angle / 2));

  // Length of the right angle side
  const distance = computeSideLength(maxRadius, angle / 2);

  const [startX, startY] = radiusPoint(
    [v1[0], v1[1]],
    [v1[2], v1[3]],
    distance
  );
  const [endX, endY] = radiusPoint([v2[0], v2[1]], [v2[2], v2[3]], distance);

  return {
    start: [startX, startY],
    end: [endX, endY],
    radius: maxRadius,
    sweepFlag
  };
}
