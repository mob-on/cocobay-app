import { useResources } from "@contexts/Resources";
import useTapsService from "@services/useTaps.service";
import { useEffect } from "react";

/**
 * Component that starts the tap counter and syncing when mounted. It's only purpose is to
 * trigger the tap counter and sync to start when the app is loaded.
 */
const TapCounterTimer: React.FC<object> = () => {
  const { allLoaded } = useResources();
  const [, { startTimeout, startSync }] = useTapsService();
  useEffect(() => {
    if (!allLoaded) return;
    startTimeout();
    startSync();
  }, [startTimeout, startSync, allLoaded]);
  return <></>;
};

export default TapCounterTimer;
