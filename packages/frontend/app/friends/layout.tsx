import { FriendsContextProvider } from "@src/shared/context/FriendsContext";
import { ReactElement } from "react";

export default function BoostsLayout({ children }: { children: ReactElement }) {
  return <FriendsContextProvider>{children}</FriendsContextProvider>;
}
