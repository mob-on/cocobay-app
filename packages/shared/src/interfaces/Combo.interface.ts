import { WithPicture } from "../../../backend/dist/shared/src/interfaces/_shared.interface";
export type ComboAction = "points" | "boost";

// A combo is a random event that can happen randomly. When the comboCount reaches maxComboCount,
// we give user a present: points, level-ups?, boosts?, collectibles? etc.
export interface Combo extends WithPicture {
  current: number;
  objective: number;
  cooldownUntil: Date;
  // if current === objective, specify the action user gets.
  // This will allow backend to control frontend behavior.
  action?: ComboAction;
  message?: string;
}

// wrapper for actions that can give a combo.
// if didGetCombo is true, frontend should show a message and update the combo count.
export type WithCombo<T> = {
  combo: Combo;
} & T;
