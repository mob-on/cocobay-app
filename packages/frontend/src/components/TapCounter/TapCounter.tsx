import React, { useMemo } from "react";
import styles from "frontend/src/styles/components/tapCounter/tapCounter.module.scss";
import { useTapCounter } from "frontend/src/shared/context/TapCounterContext";
import Cost from "../shared/Cost";
import NumberFormatter from "frontend/src/shared/lib/NumberFormatter";

const TapCounter: React.FC = () => {
  const { data } = useTapCounter();
  const numberFormatter = new Intl.NumberFormat("en-US");
  const formattedTapCount = useMemo(
    () => numberFormatter.format(data.tapCount),
    [data.tapCount],
  );
  const formattedPassiveIncome = useMemo(
    () => NumberFormatter.format(data.passiveIncome * 3600),
    [data.passiveIncome],
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
