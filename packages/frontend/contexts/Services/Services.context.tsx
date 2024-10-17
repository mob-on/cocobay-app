import type { useBoostsService } from "@src/hooks/services/useBoosts.service";
import type { useBuildsService } from "@src/hooks/services/useBuilds.service";
import { createContext } from "react";

import { useGameStateService } from "../GameData";

export interface ServicesContextDefinition {
  gameStateService: ReturnType<typeof useGameStateService>;
  boostsService: ReturnType<typeof useBoostsService>;
  buildsService: ReturnType<typeof useBuildsService>;
  // friendsService: ReturnType<typeof useFriendsService>;
  // comboService: ReturnType<typeof useComboService>;
}

export const ServicesContext = createContext<ServicesContextDefinition>(
  {} as ServicesContextDefinition,
);
