"use client";

import { Build } from "@shared/src/interfaces";
import BuildPopup from "@src/components/Build/BuildPopup";
import DailyCombo from "@src/components/Build/DailyCombo";
import Button from "@src/components/shared/Button";
import Card from "@src/components/shared/Card";
import TapCounter from "@src/components/TapCounter";
import { useBuilds } from "@src/shared/context/BuildsContext";
import useLogger from "@src/shared/hooks/useLogger";
import usePopup from "@src/shared/hooks/usePopup";
import useBuildsService from "@src/shared/services/useBuildsService";
import styles from "@src/styles/pages/build.module.css";
import Popup from "antd-mobile/es/components/popup";
import TabBar from "antd-mobile/es/components/tab-bar";
import Toast from "antd-mobile/es/components/toast";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const tabs = [
  {
    key: "building",
    title: "Buildings",
  },
  {
    key: "event",
    title: "Events",
  },
  {
    key: "employee",
    title: "Employees",
  },
];

export default function Boosts() {
  const buildsService = useBuildsService();
  const { builds } = useBuilds();
  const logger = useLogger("Builds");
  const [currentTab, setCurrentTab] = useState(tabs[0].key);
  const [popupState, _showPopup, hidePopup] = usePopup();

  const [comboPopupState, _showComboPopup, hideComboPopup] = usePopup();
  const showComboPopup = useCallback(() => _showComboPopup(), []);

  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/earn");
    router.prefetch("/friends");
  }, []);

  const currentBuild = useMemo(() => {
    return builds.find((task) => task.id === popupState.id) || ({} as Build);
  }, [builds, popupState.id]);

  const showPopup = useCallback(
    (id: string) => {
      _showPopup(id);
    },
    [currentBuild.id],
  );

  const categorizedBuilds = useMemo(() => {
    return builds.reduce<{
      building: Build[];
      event: Build[];
      employee: Build[];
    }>(
      (res, next) => {
        res[next.type].push(next);
        return res;
      },
      { building: [], event: [], employee: [] },
    );
  }, [builds]);

  const onUpgrade = useCallback(async () => {
    if (currentBuild) {
      try {
        await buildsService.upgrade(currentBuild.id);
        // TODO: add a success animation? Maybe just coins, going from the bottom of the screen upward, and vibration?
        hidePopup();
      } catch (e) {
        // Possibly, integrate logger.error with the tracker? Or create a new logger method like `criticalError`?
        // Or maybe we don't need this with a error transport? Let's think about it!
        if (typeof e !== "string") {
          logger.error("Got a critical error!", e);
        }
        Toast.show({
          icon: "fail",
          content: e,
        });
      }
    } else {
      Toast.show({
        icon: "fail",
        content: "Build not found!",
      });
    }
  }, [builds, currentBuild.id, buildsService]);

  return (
    <>
      <section id="build" className={styles.build}>
        <TapCounter />
        <DailyCombo onClick={showComboPopup} />
        <TabBar
          safeArea={false}
          className={styles.tabBar}
          onChange={(key) => setCurrentTab(key)}
        >
          {tabs.map((tab) => (
            <TabBar.Item
              className={
                styles.tab +
                ` ${currentTab === tab.key ? styles.tabActive : ""}`
              }
              key={tab.key}
              title={tab.title}
            />
          ))}
        </TabBar>
        <div className={styles.builds}>
          {(categorizedBuilds[currentTab] ?? []).map((build) => (
            <Card
              key={build.id}
              type="build"
              data={build}
              onClick={showPopup}
            />
          ))}
        </div>
      </section>
      <Popup
        visible={popupState.show}
        position="bottom"
        onMaskClick={hidePopup}
        onClose={hidePopup}
        bodyClassName={styles.buildPopup}
      >
        <BuildPopup build={currentBuild} onAction={onUpgrade} />
      </Popup>
      <Popup
        visible={comboPopupState.show}
        position="bottom"
        onMaskClick={hideComboPopup}
        onClose={hideComboPopup}
        bodyClassName={styles.comboPopup}
      >
        {/* TODO: Add combo info here */}
        <h3>Get combos, something something</h3>
        <Button
          onClick={hideComboPopup}
          className={styles.onUpgrade}
          color="gradient"
        >
          Okay!
        </Button>
      </Popup>
    </>
  );
}
