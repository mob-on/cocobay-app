import React from "react";
import TapArea from "src/components/TapArea";
import TapEffects from "src/components/TapEffects";
import styles from "src/styles/pages/index.module.scss";
import { TapsEffectsContextProvider } from "src/shared/context/tapEffectsContext";
import { LevelingContextProvider } from "src/shared/context/levelingContext";
import Leveling from "src/components/Leveling";
import Stamina from "src/components/Stamina";
import HomeAvatar from "src/components/HomeAvatar";
import TapCounter from "src/components/TapCounter";


export default function Home() {
  return (
    <TapsEffectsContextProvider>
      <>
        <TapEffects />
        <section id="home" className={styles.home}>
          {/* <div className="bar">
            <SetOutline />
          </div> */}
          <div className={styles.avatar}>
            <HomeAvatar />
          </div>
          <div className={styles.tapCounterWrapper}>
            <TapCounter />
          </div>
          <div className={styles.tap}>
            <TapArea />
          </div>
          <footer className={styles.footer}>
            <LevelingContextProvider>
              <Leveling />
            </LevelingContextProvider>
            <Stamina />
          </footer>
        </section>
      </>
    </TapsEffectsContextProvider>
  );
}
