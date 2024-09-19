// Game state interface. The most important part of the app.

// Describes energy, points, taps, leveling and crucial data syncing.
export interface GameState {
  // energy
  maxEnergy: number;
  energyRecoveryPerSecond: number;

  // points
  pointCount: number;
  pointIncomePerSecond: number;

  // taps
  tapCount: number;

  // sync data
  lastGameStateSyncTime: string;

  // leveling data
  level: number;
  levelName: string;
  targetExp: number;
  currentExp: number;
  maxLevel: number;
}

// Frontend state, with backend-agnostic fields
export interface FrontendGameState extends GameState {
  energy: number;
  tapCountSynced: number;
  tapCountPending: number;
}
