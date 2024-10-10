"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameData.api";
import { useResources } from "@contexts/Resources";
import useLogger from "@hooks/useLogger";
import type { Friend } from "@shared/src/interfaces";
import { useResourceInitializer } from "@src/hooks/useResourceInitializer";
import { useReducer } from "react";

import { type FriendsAction, FriendsContext } from "./Friends.context";

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

export const FriendsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [friends, dispatchFriends] = useReducer(
    friendsReducer,
    defaultFriendsData,
  );
  const { resources = {}, allLoaded } = useResources();
  const logger = useLogger("FriendsProvider");

  useResourceInitializer({
    queryKey: GAME_DATA_QUERY_KEY,
    dispatch: dispatchFriends,
    logger,
  });

  return (
    <FriendsContext.Provider value={{ friends, dispatchFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};
