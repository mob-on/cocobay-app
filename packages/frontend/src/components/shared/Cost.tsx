import Image from "next/image";
import styles from "frontend/src/styles/components/shared/cost.module.scss";
import coin from "frontend/public/media/coco-coin.svg";
import { ReactElement } from "react";
import NumberFormatter from "frontend/src/shared/lib/NumberFormatter";

// Draws a coin next to the passed element, with the optional cost number.
const Cost: React.FC<{
  cost?: number;
  children?: ReactElement | string;
  size?: number;
  className?: string;
  position?: "left" | "right";
}> = ({ cost, children, size = 16, className, position = "left" }) => {
  const img = (
    <Image
      style={{ width: size, height: size }}
      className={styles.coin + ` ${className || ""}`}
      src={coin}
      alt="coin"
      width={size}
      height={size}
    />
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
