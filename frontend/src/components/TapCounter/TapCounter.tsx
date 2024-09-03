import React from "react";
import styles from "src/styles/components/tapCounter/tapCounter.module.scss";
import { useTapCounter } from "src/shared/context/TapCounterContext";

/**
 * Calculates the font size for the tap counter, given the tap count.
 * The font size is linearly interpolated between 60px for 6 digits
 * and 35px for 18 digits.
 * @returns the font size as a string, e.g. "60px"
 */
const calculateFontSize = (tapCount: number) => {
  const digits = tapCount.toString().length;
  if (digits <= 6) {
    return "60px";
  }
  const maxFontSize = 60;
  const minFontSize = 35;
  const maxDigits = 18;
  const fontSize =
    ((maxFontSize - minFontSize) * (maxDigits - digits)) / (maxDigits - 6) +
    minFontSize;
  return `${fontSize}px`;
};

const TapCounter: React.FC = () => {
  const { data } = useTapCounter();

  const numberFormatter = new Intl.NumberFormat("en-US");
  const formattedTapCount = numberFormatter.format(data.tapCount);
  return (
    <div className={styles.tapCounter}>
      <h1 style={{ fontSize: calculateFontSize(data.tapCount) }}>
        {formattedTapCount}
      </h1>
    </div>
  );
};

export default TapCounter;
