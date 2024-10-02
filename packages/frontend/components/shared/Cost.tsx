import NumberFormatter from "@src/shared/lib/NumberFormatter";
import styles from "@src/styles/components/shared/cost.module.css";
import { ReactElement, useMemo } from "react";

import Coin from "../svg/Coin";

// Draws a coin next to the passed element, with the optional cost number.
const Cost: React.FC<{
  cost?: number;
  children?: ReactElement | string;
  size?: number;
  className?: string;
  position?: "left" | "right";
}> = ({ cost, children, size = 16, className, position = "left" }) => {
  const img = useMemo(
    () => (
      <Coin
        style={{ width: size, height: size }}
        className={styles.coin + ` ${className || ""}`}
      />
    ),
    [],
  );
  return (
    <span className={styles.cost}>
      {position === "left" && img}
      {cost && (
        <>
          <span>{NumberFormatter.format(cost)}</span>&nbsp;
        </>
      )}
      {children || ""}
      {position === "right" && <>&nbsp;{img}</>}
    </span>
  );
};

export default Cost;
