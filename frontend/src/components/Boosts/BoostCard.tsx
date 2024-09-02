import React from "react";
import styles from 'src/styles/components/boosts/boostCard.module.scss';
import Image from "next/image";
import coin from 'public/media/coco-coin.svg';
import { IBoost } from "./Boosts";


const BoostCard: React.FC<{ boost: IBoost, onClick: React.EventHandler<React.MouseEvent>}> = React.memo(({ boost, onClick }) => {
  const isLastLevel = boost.level === boost.maxLevel;
  return (
    <div onClick={isLastLevel ? null : onClick} className={styles.boost}>
      <Image src={boost.iconSrc} alt={boost.name} width={64} height={64} />
      <p>{boost.name}</p>
      {
        boost.type === 'daily' && (
          <span>Left today: {boost.maxToday - boost.usedToday}</span>
        )
      }
      {
        boost.type === 'regular' && (
          isLastLevel ? (
            <span>Level {boost.level} - maximum</span>
          ) : (
            <div className={styles.cost}>
              <Image src={coin} alt="coin" width={16} height={16} />
              <span>{boost.cost} - Level {boost.level}</span>
            </div>
          )
        )
      }
    </div>
  )
});

export default BoostCard;
