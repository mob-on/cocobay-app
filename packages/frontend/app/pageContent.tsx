"use client";

import HomeAvatar from "@src/components/HomeAvatar";
import Leveling from "@src/components/Leveling";
import Stamina from "@src/components/Stamina";
import TapArea from "@src/components/TapArea";
import TapCounter from "@src/components/TapCounter";
import TapEffects from "@src/components/TapEffects";
import { LevelingContextProvider } from "@src/shared/context/LevelingContext";
import { useLoading } from "@src/shared/context/LoadingContext";
import { TapsEffectsContextProvider } from "@src/shared/context/TapEffectsContext";
import { UserContextProvider } from "@src/shared/context/UserContext";
import styles from "@styles/pages/index.module.css";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef } from "react";

export default function PageContent() {
  const router = useRouter();
  const resolver = useRef(null as unknown as Function);
  const loading = useLoading();
  if (!loading.allLoaded) {
    use(new Promise((resolve) => (resolver.current = resolve)));
  }
  useEffect(() => {
    if (loading.allLoaded && resolver.current instanceof Function)
      resolver.current();
    router.prefetch("/builds");
    router.prefetch("/earn");
    router.prefetch("/boosts");
    router.prefetch("/friends");
  }, [loading.allLoaded]);

  return (
    <>
      <TapsEffectsContextProvider>
        <>
          <TapEffects />
          <section id="home" className={styles.home}>
            <div className={styles.avatar}>
              <UserContextProvider>
                <HomeAvatar />
              </UserContextProvider>
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
