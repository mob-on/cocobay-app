import { useContext } from "react";

import { FriendsContext } from "./Friends.context";

export const useFriends = () => useContext(FriendsContext);
