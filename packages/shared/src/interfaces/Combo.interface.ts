export type ComboAction = "points" | "boost";

// A combo is a random event that can happen randomly. When the comboCount reaches maxComboCount,
// we give user a present: points, level-ups?, boosts?, collectibles? etc.
export interface Combo {
  current: number;
  objective: number;
  cooldownUntil: Date;
  // if current === objective, specify the action user gets.
  // This will allow backend to control frontend behavior.
  action?: ComboAction;
  message?: string;
}

// wrapper for actions that can give a combo
export type WithCombo<T> = { combo: Combo } & T;
