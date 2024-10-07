import type { GameDataDto } from "@shared/src/dto/gameData.dto";
import type { Friend } from "@shared/src/interfaces";
import { createContext } from "react";

export type FriendsContext = {
  friends: Friend[];
  dispatchFriends: React.Dispatch<FriendsAction>;
};

export type FriendsAction =
  | { type: "DATA_INITIALIZE"; payload: GameDataDto }
  | { type: "FRIEND_UPDATE"; payload: Friend };

export const FriendsContext = createContext<FriendsContext>({
  friends: [],
  dispatchFriends: () => {},
});
