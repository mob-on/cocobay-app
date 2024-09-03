import React from "react";
import styles from "src/styles/components/tapCounter/tapCounter.module.scss";
import { useTapCounter } from "src/shared/context/TapCounterContext";
import Cost from "../shared/Cost";

const TapCounter: React.FC = () => {
  const { data } = useTapCounter();

  const numberFormatter = new Intl.NumberFormat("en-US");
  const formattedTapCount = numberFormatter.format(data.tapCount);
  return (
    <div className={styles.tapCounter}>
      <h1 style={{ fontSize: 30, fontFamily: "MartianMono" }}>
        <Cost size={32}>
          <span>{formattedTapCount}</span>
        </Cost>
      </h1>
    </div>
  );
};

export default TapCounter;
