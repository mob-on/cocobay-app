import useTapsService from "@src/shared/services/useTapsService";
import { useEffect } from "react";

/**
 * Component that starts the tap counter and syncing when mounted. It's only purpose is to
 * trigger the tap counter and sync to start when the app is loaded.
 */
const TapCounterTimer: React.FC<object> = () => {
  const [, { startTimeout, startSync }] = useTapsService();
  useEffect(() => {
    startTimeout();
    startSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};

export default TapCounterTimer;
