import { useEffect } from "react";
import useTapsService from "src//shared/services/useTapsService";

/**
 * Component that starts the tap counter when mounted. It's only purpose is to
 * trigger the tap counter to start when the app is loaded.
 */
const TapCounterTimer: React.FC<{}> = () => {
  const [, { startTimeout }] = useTapsService();
  useEffect(() => {
    startTimeout();
  }, []);
  return <></>;
};

export default TapCounterTimer;
