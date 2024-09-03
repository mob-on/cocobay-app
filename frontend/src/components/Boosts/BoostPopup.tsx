import React, { memo } from "react";
import styles from "src/styles/components/boosts/boostPopup.module.scss";
import Image from "next/image";
import { IBoost } from "./Boosts";
import Cost from "../shared/Cost";
import Button from "../shared/Button";

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
            <Cost cost={boost.cost}>
              <span> to Level {boost.level + 1}</span>
            </Cost>
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
          color="gradient"
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
