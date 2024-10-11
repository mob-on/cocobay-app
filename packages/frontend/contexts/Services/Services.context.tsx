import type { GameDataDto } from "@shared/src/dto/game-data.dto";
import type { Friend } from "@shared/src/interfaces";
import useBoostsService from "@src/hooks/services/useBoosts.service";
import useBuildsService from "@src/hooks/services/useBoosts.service";
import { createContext } from "react";

import { useGameStateService } from "../GameData";

export type ServiceContext = {
  gameStateService: ReturnType<typeof useGameStateService>;
  boostsService: ReturnType<typeof useBoostsService>;
  buildsService: ReturnType<typeof useBuildsService>;
  // friendsService: ReturnType<typeof useFriendsService>;
  // comboService: ReturnType<typeof useComboService>;
};

export const ServiceContext = createContext<ServiceContext>(
  {} as ServiceContext,
);
