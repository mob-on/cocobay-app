import React, { useMemo } from "react";
import { useGameState } from "src/shared/context/GameStateContext";
import NumberFormatter from "src/shared/lib/NumberFormatter";
import styles from "src/styles/components/tapCounter/tapCounter.module.scss";

import Cost from "../shared/Cost";

const TapCounter: React.FC = () => {
  const { taps } = useGameState();
  const numberFormatter = new Intl.NumberFormat("en-US");
  const formattedTapCount = useMemo(
    () => numberFormatter.format(taps.tapCount),
    [taps.tapCount],
  );
  const formattedPassiveIncome = useMemo(
    () => NumberFormatter.format(taps.passiveIncome * 3600),
    [taps.passiveIncome],
  );
  return (
    <div className={styles.tapCounter}>
      <h1 style={{ fontSize: 30 }}>
        <Cost size={32}>
          <span>{formattedTapCount}</span>
        </Cost>
      </h1>
      <p>{formattedPassiveIncome} per hour</p>
    </div>
  );
};

export default TapCounter;
