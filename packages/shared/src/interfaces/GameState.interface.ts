// Game state interface. The most important part of the app.
// Describes energy, points, taps, leveling and crucial data syncing.
export interface GameState {
  // energy
  maxEnergy: number;
  energyRecoveryPerSecond: number;

  // points
  pointCount: number;
  pointIncomePerSecond: number;
  pointsPerTap: number;

  // taps
  tapCount: number;

  // leveling data
  level: number;
  levelName: string;
  targetExp: number;
  currentExp: number;
  maxLevel: number;
  lastSyncTime: Date;
}

// Frontend state, with backend-agnostic fields
export interface FrontendGameState extends GameState {
  energy: number;
  clientLogicState: {
    pointCountSynced: number;
    clientClockStart: Date;
  };
}
