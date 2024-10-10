import { Boost } from "@shared/src/interfaces";
import styles from "@src/styles/components/shared/card/boostCard.module.css";
import React from "react";

import Cost from "../Cost";

const BoostCard: React.FC<{
  boost: Boost;
  onClick: (id: string) => void;
}> = ({ boost, onClick }) => {
  return <div></div>
  // const isLastLevel = boost.level === boost.maxLevel;
  // return (
  //   <div
  //     onClick={isLastLevel ? undefined : () => onClick(boost.id)}
  //     className={styles.boost}
  //   >
  //     <img src={boost.iconSrc} alt={boost.name} width={64} height={64} />
  //     <p>{boost.name}</p>
  //     {boost.type === "daily" && (
  //       <span>Left today: {boost.maxToday - boost.usedToday}</span>
  //     )}
  //     {boost.type === "regular" &&
  //       (isLastLevel ? (
  //         <span>Level {boost.level} - maximum</span>
  //       ) : (
  //         <Cost cost={boost.cost}>
  //           <span> - Level {boost.level}</span>
  //         </Cost>
  //       ))}
  //   </div>
  // );
};

export default BoostCard;
