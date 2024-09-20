import { Build } from "@shared/src/interfaces";
import styles from "@src/styles/components/shared/card/buildCard.module.scss";
import React from "react";

import Cost from "../Cost";

const BuildCard: React.FC<{ build: Build; onClick: (id: string) => void }> = ({
  build,
  onClick,
}) => {
  const isLastLevel = build.level === build.maxLevel;
  return (
    <div
      onClick={isLastLevel ? undefined : () => onClick(build.id)}
      className={styles.buildCard}
    >
      <img src={build.iconSrc} alt={build.name} width={64} height={64} />
      <p>{build.name}</p>
      <div className={styles.buildInfo}>
        <p>Lv {build.level}</p>
        {isLastLevel ? (
          <span>Max level reached!</span>
        ) : (
          <Cost cost={build.income} />
        )}
      </div>
    </div>
  );
};

export default BuildCard;
