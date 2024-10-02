import { useLoading } from "@src/shared/context/LoadingContext";
import useTapsService from "@src/shared/services/useTapsService";
import { useEffect } from "react";

/**
 * Component that starts the tap counter and syncing when mounted. It's only purpose is to
 * trigger the tap counter and sync to start when the app is loaded.
 */
const TapCounterTimer: React.FC<object> = () => {
  const { allLoaded } = useLoading();
  const [, { startTimeout, startSync }] = useTapsService();
  useEffect(() => {
    if (!allLoaded) return;
    startTimeout();
    startSync();
  }, [startTimeout, startSync, allLoaded]);
  return <></>;
};

export default TapCounterTimer;
