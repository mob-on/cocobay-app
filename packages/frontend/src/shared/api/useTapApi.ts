import { useTapCounter } from "../context/TapCounterContext";
import useLogger from "../hooks/useLogger";
import { ITaps } from "../services/useTapsService";
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

const syncTaps = (): Promise<boolean> => {
  const [axios] = useMainApiConfig();
  const { data: taps, setTapData } = useTapCounter();
  const timestamp = new Date();
  const logger = useLogger("syncTaps");

  return new Promise<boolean>(async (resolve, reject) => {
    axios
      .post("/v1/taps/sync", { taps, timestamp: timestamp.toISOString() })
      .then(async () => {
        try {
          const response = await axios.post("/api/sync-taps", { taps });

          const serverData: ITaps | undefined = response?.data;
          if (serverData) {
            const { passiveIncome } = serverData;
            setTapData(
              (current: ITaps) =>
                ({
                  ...current,
                  passiveIncome: passiveIncome,
                }) as ITaps,
            );
          }
          return resolve(true);
        } catch (error) {
          return reject(error);
        }
      })
      .catch(reject);
  }).catch((e) => {
    logger.error(e);
    return false;
  });
};

export const useTapApi = () => {
  return { getTaps, syncTaps };
};
