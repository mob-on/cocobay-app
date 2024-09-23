import { Build } from "@shared/src/interfaces";
import styles from "@src/styles/components/build/buildPopup.module.css";
import React, { memo } from "react";

import Button from "../shared/Button";
import Cost from "../shared/Cost";

// TODO: This component is extremely similar to BoostPopup, we should look into combining them.
// I don't want to do this right now, because we might have other similar components
const BuildPopup: React.FC<{ build: Build; onAction: (id: string) => void }> =
  memo(({ build, onAction }) => {
    if (!build) return <></>;
    const isLastLevel = build.level === build.maxLevel;

    return (
      <>
        <img src={build.iconSrc} alt={build.name} width={128} height={128} />
        <h2>{build.name}</h2>
        <h3>{build.description}</h3>
        {isLastLevel ? (
          <p>You've reached the last level!</p>
        ) : (
          <Cost cost={build.cost}>
            <span> to Level {build.level + 1}</span>
          </Cost>
        )}
        <br />
        <Button
          onClick={() => onAction(build.id)}
          className={styles.onUpgrade}
          color="gradient"
        >
          {isLastLevel ? "Okay" : "Upgrade"}
        </Button>
      </>
    );
  });

BuildPopup.displayName = "BuildPopup";

export default BuildPopup;
