import React, { memo } from "react";
import styles from "src/styles/components/boosts/boostPopup.module.scss";
import Image from "next/image";
import coin from "public/media/coco-coin.svg";
import { Button } from "antd-mobile";
import { IBoost } from "./Boosts";

const BoostPopup: React.FC<{ boost: IBoost; onAction: (id: number) => void }> =
  memo(({ boost, onAction }) => {
    if (!boost) return <></>;
    const isLastLevel = boost.level === boost.maxLevel;
    const leftToday = boost.maxToday - boost.usedToday;
    return (
      <>
        <Image src={boost.iconSrc} alt={boost.name} width={128} height={128} />
        <h2>{boost.name}</h2>
        <h3>{boost.description}</h3>
        {boost.type === "regular" ? (
          isLastLevel ? (
            <p>You've reached the last level!</p>
          ) : (
            <div className={styles.cost}>
              <Image src={coin} alt="coin" width={16} height={16} />
              <span>
                {boost.cost} to Level {boost.level + 1}
              </span>
            </div>
          )
        ) : (
          <span>
            {leftToday > 0
              ? `Left today: ${leftToday}`
              : "You've used all your daily boosts! Come tomorrow!"}
          </span>
        )}
        <br />
        <Button
          onClick={() => onAction(boost.id)}
          className={styles.onUpgrade}
          block
          color="primary"
          fill="solid"
        >
          {boost.type === "daily"
            ? leftToday > 0
              ? "Get"
              : "Okay"
            : "Upgrade"}
        </Button>
      </>
    );
  });

export default BoostPopup;
