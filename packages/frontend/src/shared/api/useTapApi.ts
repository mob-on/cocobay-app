import { TapDto } from "@shared/src/dto/tap.dto";
import {
  MutationKey,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";

import { useGameState } from "../context/GameStateContext";
import { ITaps, ITapSyncData } from "../services/useTapsService";
import { useMainApiConfig } from "./main/config";

export const SyncMutationKey = ["tapSync"] as MutationKey;

// Function to calculate passive income during request time
const calculatePassiveIncome = (
  lastSyncTime: number,
  passiveIncomeRate: number,
) => {
  const currentTime = Date.now();
  const timeElapsed = (currentTime - lastSyncTime) / 1000; // Convert to seconds
  return Math.floor(timeElapsed) * passiveIncomeRate; // Adjust the passive income
};

const getTaps = (): Promise<ITaps> => {
  const [axios] = useMainApiConfig();

  return new Promise(async (resolve, reject) => {
    await axios
      .get<ITaps>("/v1/tap")
      .then((taps) => resolve(taps.data))
      .catch(reject);
  });
};

const syncTaps = () => {
  const [axios] = useMainApiConfig();

  return useMutation({
    mutationFn: async (syncData: ITapSyncData) => {
      const timestamp = new Date().toISOString();
      const tapDto = new TapDto({
        timestamp,
        ...syncData,
      });
      try {
        const response = await axios.post("/v1/taps/sync", tapDto);
        if (response.status !== 200) {
          throw new Error("Failed to track events");
        }
        return response.data;
      } catch (e: unknown) {
        throw e;
      }
    },
    mutationKey: SyncMutationKey,
  });
};

export const useTapApi = () => {
  return { getTaps, syncTaps };
};
