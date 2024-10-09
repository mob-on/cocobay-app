import { useContext } from "react";

import { BoostsContext } from "./Boosts.context";

/*
 * Provider implemented in [[./Boosts.provider.tsx]]
 */
export const useBoosts = () => useContext(BoostsContext);
