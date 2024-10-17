"use client";

import { useResources } from "@contexts/Resources";
import { TapEffectsProvider } from "@contexts/TapEffects";
import { BoostData } from "@src/components/BoostData";
import HomeAvatar from "@src/components/HomeAvatar";
import Leveling from "@src/components/Leveling";
import Stamina from "@src/components/Stamina";
import TapArea from "@src/components/TapArea";
import TapCounter from "@src/components/TapCounter";
import TapEffects from "@src/components/TapEffects";
import styles from "@styles/pages/index.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PageContent() {
  const router = useRouter();
  const loading = useResources();
  useEffect(() => {
    router.prefetch("/builds");
    router.prefetch("/earn");
    router.prefetch("/boosts");
    router.prefetch("/friends");
  }, [loading.allLoaded, router]);

  return (
    <>
      <TapEffectsProvider>
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
      </TapEffectsProvider>
      <footer className={styles.footer + " gap-inner-constant"}>
        <Leveling className="self-end" />
        <BoostData className="ml-auto" />
        <Stamina />
      </footer>
    </>
  );
}
