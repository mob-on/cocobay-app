"use client";

import { Build } from "@shared/src/interfaces";
import BuildPopup from "@src/components/Build/BuildPopup";
import DailyCombo from "@src/components/Build/DailyCombo";
import Button from "@src/components/shared/Button";
import Card from "@src/components/shared/Card";
import TapCounter from "@src/components/TapCounter";
import { useBuilds } from "@src/shared/context/BuildsContext";
import usePopup from "@src/shared/hooks/usePopup";
import styles from "@src/styles/pages/build.module.scss";
import Popup from "antd-mobile/es/components/popup";
import TabBar from "antd-mobile/es/components/tab-bar";
import Toast from "antd-mobile/es/components/toast";
import { useCallback, useMemo, useState } from "react";

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
  const { builds } = useBuilds();
  const [currentTab, setCurrentTab] = useState(tabs[0].key);
  const [popupState, _showPopup, hidePopup] = usePopup();

  const [comboPopupState, _showComboPopup, hideComboPopup] = usePopup();
  const showComboPopup = useCallback(() => _showComboPopup(), []);

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

  const onUpgrade = useCallback(
    (/*id: string*/) => {
      hidePopup();
      if (currentBuild) {
        // update the build via backend. check boosts page comments for more info.
      } else {
        Toast.show({
          icon: "fail",
          content: "Build not found!",
        });
      }
    },
    [builds, currentBuild.id],
  );

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
