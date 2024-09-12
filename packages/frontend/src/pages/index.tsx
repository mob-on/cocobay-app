import React from "react";
import HomeAvatar from "src//components/HomeAvatar";
import Leveling from "src//components/Leveling";
import Stamina from "src//components/Stamina";
import TapArea from "src//components/TapArea";
import TapCounter from "src//components/TapCounter";
import TapEffects from "src//components/TapEffects";
import { LevelingContextProvider } from "src//shared/context/LevelingContext";
import { TapsEffectsContextProvider } from "src//shared/context/TapEffectsContext";
import useTelegram from "src//shared/hooks/useTelegram";
import styles from "src//styles/pages/index.module.scss";

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
