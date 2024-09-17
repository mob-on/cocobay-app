import styles from "@src/styles/components/leveling/leveling.module.scss";
import { ProgressBar } from "antd-mobile";
import React, { useEffect, useState } from "react";

export interface ILevelingData {
  level: number;
  levelName: string;
  targetExp: number;
  currentExp: number;
  maxLevel: number;
}

const defaultLevelingData: ILevelingData = {
  level: 1,
  levelName: "Coco",
  targetExp: 100,
  currentExp: 0,
  maxLevel: 10,
};

const Leveling: React.FC = () => {
  const [data, setData] = useState(defaultLevelingData);
  const { currentExp, targetExp, level, levelName, maxLevel } = data;
  const percent = Math.round((currentExp / targetExp) * 100);

  useEffect(() => {
    // fetch data and put it into the state.
    setData({
      level: 2,
      targetExp: 1000,
      currentExp: 425,
      levelName: "Super Coco",
      maxLevel: 10,
    });
  }, []);

  return (
    <>
      <div className={styles.levelInfo}>
        <h3>Next level</h3>
        <ProgressBar percent={percent} />
        <div className={styles.level}>
          <span>{levelName}</span>
          <span>
            {level}/{maxLevel}
          </span>
        </div>
      </div>
    </>
  );
};

export default Leveling;
