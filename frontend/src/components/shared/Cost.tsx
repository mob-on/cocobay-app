import Image from "next/image";
import styles from 'src/styles/components/shared/cost.module.scss';
import coin from 'public/media/coco-coin.svg';
import { ReactElement } from "react";
import numberTransform from "src/shared/lib/numberTransform";

// Draws a coin next to the passed element
const Cost: React.FC<{ cost: number, children?: ReactElement }> = ({ cost, children }) => {
  return (
    <span className={styles.cost}>
      <Image className={styles.coin} src={coin} alt="coin" width={16} height={16} />
      <span>{ numberTransform(cost) }</span>&nbsp;
      { children || '' }
    </span>
  )
}

export default Cost;