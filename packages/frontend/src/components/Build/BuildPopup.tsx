import React, { memo } from "react";
import styles from "frontend/src/styles/components/build/buildPopup.module.scss";
import Image from "next/image";
import { IBuild } from "./Build";
import Cost from "../shared/Cost";
import Button from "../shared/Button";

// TODO: This component is extremely similar to BoostPopup, we should look into combining them.
// I don't want to do this right now, because we might have other similar components
const buildPopup: React.FC<{ build: IBuild; onAction: (id: number) => void }> =
  memo(({ build, onAction }) => {
    if (!build) return <></>;
    const isLastLevel = build.level === build.maxLevel;

    return (
      <>
        <Image
          priority
          src={build.iconSrc}
          alt={build.name}
          width={128}
          height={128}
        />
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

export default buildPopup;
