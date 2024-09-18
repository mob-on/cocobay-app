import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { ITaps } from "../services/useTapsService";
import { useLoading } from "./LoadingContext";

export const TAP_EFFECTS_TIMEOUT = 1000; // remove taps from list after this time1
export const TAP_EFFECTS_THROTTLE = 50; // min time before triggering ring animation

export type GameAction =
  | { type: "TAPS_APPLY_PASSIVE_INCOME" }
  | { type: "STAMINA_CONSUME" }
  | { type: "STAMINA_REGEN" }
  | { type: "TAPS_UPDATE"; payload: ITaps }
  | { type: "TAPS_SET_PASSIVE_INCOME"; payload: number }
  | { type: "TAPS_REGISTER_TAP"; payload?: (boolean) => void };

export interface IStamina {
  current: number;
  max: number;
  regen: number;
}

export interface IGameState {
  taps: ITaps;
  stamina: IStamina;
  pendingTaps: number;
}

export type IGameStateContext = IGameState & {
  dispatchGameState: React.Dispatch<GameAction>;
};

const defaultGameData: IGameState = {
  taps: {
    tapCount: 400,
    syncedTapCount: 400,
    pointCount: 1248,
    passiveIncome: 1,
    perTap: 1,
  },
  stamina: {
    current: 50,
    max: 500,
    regen: 3,
  },
  pendingTaps: 0,
};

const gameStateReducer = (
  state: IGameState,
  action: GameAction,
): IGameState => {
  const { stamina, taps, pendingTaps } = state;
  switch (action.type) {
    case "TAPS_SET_PASSIVE_INCOME":
      return {
        pendingTaps,
        stamina,
        taps: {
          ...taps,
          passiveIncome: action.payload,
        },
      };
    case "TAPS_UPDATE":
      return {
        pendingTaps,
        stamina,
        taps: {
          ...taps,
          ...action.payload,
        },
      };
    case "TAPS_APPLY_PASSIVE_INCOME":
      return {
        pendingTaps,
        stamina,
        taps: { ...taps, pointCount: taps.pointCount + taps.passiveIncome },
      };
    case "TAPS_REGISTER_TAP":
      const { perTap } = taps;
      if (stamina.current < perTap) {
        if (typeof action.payload === "function") action.payload(false);
        return state;
      }
      if (typeof action.payload === "function") action.payload(true);
      return {
        pendingTaps: pendingTaps + 1,
        taps: {
          ...taps,
          tapCount: taps.tapCount + 1,
          pointCount: taps.pointCount + taps.perTap,
        },
        stamina: {
          ...stamina,
          current: Math.max(0, stamina.current - taps.perTap),
        },
      };
    case "STAMINA_CONSUME":
      return {
        pendingTaps,
        taps,
        stamina: {
          ...stamina,
          current: Math.max(0, stamina.current - taps.perTap),
        },
      };
    case "STAMINA_REGEN":
      return {
        pendingTaps,
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
  // TODO: implement this, after we get access to game data endpoint
  // const { resources } = useLoading();
  // const defaultGameData = resources[GAME_DATA_QUERY];
  const [state, dispatch] = useReducer(gameStateReducer, defaultGameData);

  return (
    <GameStateContext.Provider
      value={{ ...state, dispatchGameState: dispatch }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
