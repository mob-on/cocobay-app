"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameDataApi";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
import { Friend } from "@shared/src/interfaces";
import { createContext, useContext, useEffect, useReducer } from "react";

import useLogger from "../hooks/useLogger";
import { ILoadingContextResource, useLoading } from "./LoadingContext";

type FriendsContext = {
  friends: Friend[];
  dispatchFriends: React.Dispatch<FriendsAction>;
};

type FriendsAction =
  | { type: "DATA_INITIALIZE"; payload: GameDataDto }
  | { type: "FRIEND_UPDATE"; payload: Friend };

const defaultFriendsData: Friend[] = [];

const friendsReducer = (state: Friend[], action: FriendsAction): Friend[] => {
  switch (action.type) {
    case "DATA_INITIALIZE":
      return action.payload.friends;
    case "FRIEND_UPDATE": {
      const index = state.findIndex(
        (friend) => friend.id === action.payload.id,
      );
      if (index === -1) return state;
      return [
        ...state.slice(0, index),
        action.payload,
        ...state.slice(index + 1),
      ];
    }
    default:
      return state;
  }
};

const FriendsContext = createContext<FriendsContext>({
  friends: defaultFriendsData,
  dispatchFriends: () => {},
});

export const useFriends = () => useContext(FriendsContext);

export const FriendsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [friends, dispatchFriends] = useReducer(
    friendsReducer,
    defaultFriendsData,
  );
  const { resources = {} } = useLoading();
  const logger = useLogger("FriendsProvider");

  useEffect(() => {
    if (!resources[GAME_DATA_QUERY_KEY]) {
      return logger.error(`Expected ${GAME_DATA_QUERY_KEY} to be loaded`);
    }
    const { data, status } = resources[
      GAME_DATA_QUERY_KEY
    ] as ILoadingContextResource<GameDataDto>;
    if (status !== "loaded" || !data) {
      return logger.error(`Expected ${GAME_DATA_QUERY_KEY} to be loaded`);
    }
    dispatchFriends({ type: "DATA_INITIALIZE", payload: data });
  }, [resources]);

  return (
    <FriendsContext.Provider value={{ friends, dispatchFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};
