import { createContext, useContext, useReducer } from "react";

import { ITaps } from "../services/useTapsService";

export const TAP_EFFECTS_TIMEOUT = 1000; // remove taps from list after this time1
export const TAP_EFFECTS_THROTTLE = 50; // min time before triggering ring animation

export type GameAction =
  | { type: "TAPS_APPLY_PASSIVE_INCOME" }
  | { type: "STAMINA_CONSUME" }
  | { type: "STAMINA_REGEN" }
  | { type: "TAPS_UPDATE"; payload: ITaps }
  | { type: "TAPS_SET_PASSIVE_INCOME"; payload: number };

export interface IStamina {
  current: number;
  max: number;
  regen: number;
}

export interface IGameState {
  taps: ITaps;
  stamina: IStamina;
}

export type IGameStateContext = IGameState & {
  dispatchGameState: React.Dispatch<GameAction>;
};

const defaultGameData: IGameState = {
  taps: { tapCount: 1000592, passiveIncome: 1, perTap: 1 },
  stamina: {
    current: 500,
    max: 500,
    regen: 5,
  },
};

const gameStateReducer = (
  state: IGameState,
  action: GameAction,
): IGameState => {
  const { stamina, taps } = state;
  switch (action.type) {
    case "TAPS_SET_PASSIVE_INCOME":
      return {
        stamina,
        taps: {
          ...taps,
          passiveIncome: action.payload,
        },
      };
    case "TAPS_UPDATE":
      return {
        stamina,
        taps: {
          ...taps,
          ...action.payload,
        },
      };
    case "TAPS_APPLY_PASSIVE_INCOME":
      return {
        stamina,
        taps: { ...taps, tapCount: taps.tapCount + taps.passiveIncome },
      };
    case "STAMINA_CONSUME":
      return {
        taps,
        stamina: {
          ...stamina,
          current: Math.max(0, stamina.current - taps.perTap),
        },
      };
    case "STAMINA_REGEN":
      return {
        taps,
        stamina: {
          ...stamina,
          current: Math.min(stamina.max, stamina.current + stamina.regen),
        },
      };
    default:
      return state;
  }
};

// This is our game context.
// It stores tap data, stamina and other things we might need for the main game loop.
const GameStateContext = createContext({} as IGameStateContext);
export const useGameState = () => useContext(GameStateContext);
export default GameStateContext;

export const GameStateContextProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [state, dispatch] = useReducer(gameStateReducer, defaultGameData);
  return (
    <GameStateContext.Provider
      value={{ ...state, dispatchGameState: dispatch }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
