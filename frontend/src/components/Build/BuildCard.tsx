import Image from "next/image";
import React from "react";
import styles from "src/styles/components/build/buildCard.module.scss";
import Cost from "../shared/Cost";
import { IBuild } from "./Build";

const BoostCard: React.FC<{ build: IBuild; onClick: (id: number) => void }> =
  React.memo(({ build, onClick }) => {
    const isLastLevel = build.level === build.maxLevel;
    return (
      <div
        onClick={isLastLevel ? null : () => onClick(build.id)}
        className={styles.buildCard}
      >
        <Image src={build.iconSrc} alt={build.name} width={64} height={64} />
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
  });

export default BoostCard;
