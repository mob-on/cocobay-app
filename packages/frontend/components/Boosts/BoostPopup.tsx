import { Boost } from "@shared/src/interfaces";
import styles from "@src/styles/components/boosts/boostPopup.module.css";
import React, { memo } from "react";

import Button from "../shared/Button";
import Cost from "../shared/Cost";

const BoostPopup: React.FC<{ boost: Boost; onAction: (id: string) => void }> =
  memo(({ boost, onAction }) => {
    const { type } = boost;
    const leftToday = type === "claimable" ? boost.max - boost.used : undefined;
    return (
      <>
        <img src={boost.iconSrc} alt={boost.name} width={128} height={128} />
        <h2>{boost.name}</h2>
        <h3>{boost.description}</h3>
        {type === "upgradeable" ? (
          boost.level < boost.maxLevel ? (
            <Cost cost={boost.cost}>
              <span> to Level {boost.level + 1}</span>
            </Cost>
          ) : (
            <p>You've reached the last level!</p>
          )
        ) : (
          <span>
            {leftToday && leftToday > 0
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
          {type === "claimable"
            ? leftToday && leftToday > 0
              ? "Get"
              : "Okay"
            : "Upgrade"}
        </Button>
      </>
    );
  });
BoostPopup.displayName = "BoostPopup";
export default BoostPopup;
