import Image from "next/image";
import styles from "src/styles/components/shared/cost.module.scss";
import coin from "public/media/coco-coin.svg";
import { ReactElement } from "react";
import NumberFormatter from "src/shared/lib/NumberFormatter";

// Draws a coin next to the passed element, with the optional cost number.
const Cost: React.FC<{
  cost?: number;
  children?: ReactElement;
  size?: number;
  className?: string;
}> = ({ cost, children, size = 16, className }) => {
  return (
    <span className={styles.cost}>
      <Image
        style={{ width: size, height: size }}
        className={styles.coin + ` ${className || ""}`}
        src={coin}
        alt="coin"
        width={size}
        height={size}
      />
      {cost && (
        <>
          <span>{NumberFormatter.format(cost)}</span>&nbsp;
        </>
      )}
      {children || ""}
    </span>
  );
};

export default Cost;
