import { useContext } from "react";

import { BoostsContext } from "./Boosts.context";

export const useBoosts = () => useContext(BoostsContext);
