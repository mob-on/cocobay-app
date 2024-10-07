import { useContext } from "react";

import { TapEffectsContext } from "./TapEffects.context";

export const useTapEffects = () => useContext(TapEffectsContext);
