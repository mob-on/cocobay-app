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
  pendingPoints?: number | null,
): number {
  return (
    calculatePoints(basePoints, pointsPerSecond, startTime, endTime) +
    (pendingPoints || 0) * pointsPerTap
  );
}
