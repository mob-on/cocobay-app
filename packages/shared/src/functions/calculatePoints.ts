export function calculatePoints(
  basePoints: number,
  pointsPerSecond: number,
  startTime: string | Date,
  endTime: string | Date,
): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const seconds = (end - start) / 1000;
  return basePoints + pointsPerSecond * Math.round(seconds);
}

export function calculatePointsWithPending(
  basePoints: number,
  pointsPerSecond: number,
  startTime: string | Date,
  endTime: string | Date,
  pointsPerTap: number,
  pendingTaps: number = 0,
): number {
  return (
    calculatePoints(basePoints, pointsPerSecond, startTime, endTime) +
    pendingTaps * pointsPerTap
  );
}
