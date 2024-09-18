import {
  MutationKey,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";

import { useGameState } from "../context/GameStateContext";
import useLogger from "../hooks/useLogger";
import { ITaps, ITapSyncData } from "../services/useTapsService";
import { useMainApiConfig } from "./main/config";

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

const syncTaps = (
  syncData: ITapSyncData,
): UseMutationResult<ITapSyncData, Error, ITapSyncData, unknown> => {
  const [axios] = useMainApiConfig();
  const { taps, dispatchGameState } = useGameState();
  const timestamp = new Date();
  const logger = useLogger("syncTaps");

  return useMutation({
    mutationFn: async (syncData: ITapSyncData) => {
      try {
        const response = await axios.post("/v1/taps/sync", {
          taps,
          timestamp: timestamp.toISOString(),
        });
        if (response.status !== 200) {
          throw new Error("Failed to track events");
        }
        return response.data;
      } catch (e: unknown) {
        throw e;
      }
    },
    mutationKey: ["analytics"] as MutationKey,
  });
};

// return new Promise<boolean>(async (resolve, reject) => {
//   axios
//     .post("/v1/taps/sync", { taps, timestamp: timestamp.toISOString() })
//     .then(async () => {
//       try {
//         const response = await axios.post("/api/sync-taps", { taps });

//         const serverData: ITaps | undefined = response?.data;
//         if (serverData) {
//           const { passiveIncome } = serverData;
//           dispatchGameState({
//             type: "TAPS_SET_PASSIVE_INCOME",
//             payload: passiveIncome,
//           });
//         }
//         return resolve(true);
//       } catch (error) {
//         return reject(error);
//       }
//     })
//     .catch(reject);
// }).catch((e) => {
//   logger.error(e);
//   return false;
// });
// };

export const useTapApi = () => {
  return { getTaps, syncTaps };
};
