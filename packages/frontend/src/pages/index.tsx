import React from "react";
import HomeAvatar from "frontend/src/components/HomeAvatar";
import Leveling from "frontend/src/components/Leveling";
import Stamina from "frontend/src/components/Stamina";
import TapArea from "frontend/src/components/TapArea";
import TapCounter from "frontend/src/components/TapCounter";
import TapEffects from "frontend/src/components/TapEffects";
import { LevelingContextProvider } from "frontend/src/shared/context/LevelingContext";
import { TapsEffectsContextProvider } from "frontend/src/shared/context/TapEffectsContext";
import useTelegram from "frontend/src/shared/hooks/useTelegram";
import styles from "frontend/src/styles/pages/index.module.scss";

export default function Home() {
  return (
    <>
      <TapsEffectsContextProvider>
        <>
          <TapEffects />
          <section id="home" className={styles.home}>
            <div className={styles.avatar}>
              <HomeAvatar />
            </div>
            <div className={styles.tapCounterWrapper}>
              <TapCounter />
            </div>
            <div className={styles.tap}>
              <TapArea />
            </div>
          </section>
        </>
      </TapsEffectsContextProvider>
      <footer className={styles.footer}>
        <LevelingContextProvider>
          <Leveling />
        </LevelingContextProvider>
        <Stamina />
      </footer>
    </>
  );
}
