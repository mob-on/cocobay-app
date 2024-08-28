import { SetOutline } from "antd-mobile-icons";
import React from "react";
import CocoTap, { ITapEvent } from "src/components/CocoTap";
import TapEffects from "src/components/TapEffects";
import styles from "src/styles/pages/index.module.scss";
import TapEffectsContext from "src/shared/context/tapEffectsContext";
import BoostsIcon from 'public/media/icons/boosts.png';
import Image from 'next/image';
import ProgressBar from "src/components/ProgressBar";

export default function Home() {
  const [ taps, setTaps ] = React.useState<ITapEvent[]>([]);

  const currentExp = 25;
  const targetExp = 100;
  const level = 1;
  const totalLevels = 10;
  const levelingPercent = Math.round((currentExp / targetExp) * 100);
  const levelName = "Mega Coco";

  return (
    <TapEffectsContext.Provider value={{ taps, setTaps: (taps: ITapEvent[]) => {
      setTaps(taps)
    } }}>
      <TapEffects />
      <section id="home" className={styles.home}>
        <div className="bar">
          <SetOutline />
        </div>
        <div className={styles.coco}>
          <CocoTap />
        </div>
        <footer className={styles.footer}>
          <div className={styles.levelInfo}>
            <h3>Next level</h3>
            <ProgressBar progress={levelingPercent} />
            <div className={styles.level}>
              <span>{ levelName }</span>
              <span>{ level }/{ totalLevels }</span>
            </div>
          </div>
          <div className={styles.boosts}>
            <Image src={BoostsIcon} alt="boosts" width="32" height="32"/>
          </div>
        </footer>
      </section>
    </TapEffectsContext.Provider>
  );
}
