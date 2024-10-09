export function calculatePoints(
  basePoints: number,
  pointsPerSecond: number,
  startTime: string | Date,
  endTime: string | Date,
): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const seconds = (end - start) / 1000;
  return basePoints + pointsPerSecond * seconds;
}
