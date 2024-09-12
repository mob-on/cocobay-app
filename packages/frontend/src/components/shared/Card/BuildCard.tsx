import React from "react";
import styles from "frontend/src/styles/components/shared/card/buildCard.module.scss";
import Image from "next/image";
import Cost from "../Cost";
import { IBuild } from "frontend/src/components/Build";

const BuildCard: React.FC<{ build: IBuild; onClick: (id: number) => void }> = ({
  build,
  onClick,
}) => {
  const isLastLevel = build.level === build.maxLevel;
  return (
    <div
      onClick={isLastLevel ? null : () => onClick(build.id)}
      className={styles.buildCard}
    >
      <Image
        src={build.iconSrc}
        alt={build.name}
        width={64}
        height={64}
        priority
      />
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
