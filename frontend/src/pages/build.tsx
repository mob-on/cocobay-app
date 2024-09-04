import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "src/styles/pages/build.module.scss";

import { Popup, TabBar, Toast } from "antd-mobile";
import energy from "public/media/icons/energy.svg";
import { IBuild } from "src/components/Build";
import BuildPopup from "src/components/Build/BuildPopup";
import DailyCombo from "src/components/Build/DailyCombo";
import TapCounter from "src/components/TapCounter";
import Button from "src/components/shared/Button";
import Card from "src/components/shared/Card";

const defaultBuilds: IBuild[] = [
  {
    id: 1,
    name: "Hotel",
    description: "An awesome hotel for your guests to stay",
    iconSrc: energy,
    cost: 10002415,
    level: 3,
    maxLevel: 5,
    type: "building",
    lastBuilt: new Date(),
    cooldownUntil: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes, for testing
    income: 5000,
  },
  {
    id: 4,
    name: "Hotel 2",
    description: "An awesome hotel for your guests to stay",
    iconSrc: energy,
    cost: 100024154,
    level: 3,
    maxLevel: 13,
    type: "building",
    lastBuilt: new Date(),
    income: 5000,
  },
  {
    id: 5,
    name: "Hotel 3",
    description: "An awesome hotel for your guests to stay",
    iconSrc: energy,
    cost: 1000241,
    level: 3,
    maxLevel: 10,
    type: "building",
    lastBuilt: new Date(),
    income: 5000,
  },
  {
    id: 6,
    name: "Hotel 4",
    description: "An awesome hotel for your guests to stay",
    iconSrc: energy,
    cost: 1000241552,
    level: 3,
    maxLevel: 10,
    type: "building",
    lastBuilt: new Date(),
    income: 5000,
  },
  {
    id: 7,
    name: "Hotel 5",
    description: "An awesome hotel for your guests to stay",
    iconSrc: energy,
    cost: 691295912,
    level: 3,
    maxLevel: 10,
    type: "building",
    lastBuilt: new Date(),
    income: 5000,
  },
  {
    id: 8,
    name: "Hotel 6",
    description: "An awesome hotel for your guests to stay",
    iconSrc: energy,
    cost: 9200000,
    level: 3,
    maxLevel: 10,
    type: "building",
    lastBuilt: new Date(),
    income: 5000,
  },
  {
    id: 9,
    name: "Hotel",
    description: "An awesome hotel for your guests to stay",
    iconSrc: energy,
    cost: 10002415,
    level: 3,
    maxLevel: 10,
    type: "building",
    lastBuilt: new Date(),
    income: 5000,
  },
  {
    id: 2,
    name: "Mega party",
    description: "Event 1 description",
    iconSrc: energy,
    cost: 10000,
    level: 5,
    type: "event",
    maxLevel: 5,
    lastBuilt: new Date(),
    income: 354,
  },
  {
    id: 3,
    name: "Employee 1",
    description: "Employee 1 description",
    iconSrc: energy,
    cost: 10000,
    level: 2,
    type: "employee",
    maxLevel: 5,
    lastBuilt: new Date(),
    income: 25000,
  },
];

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
  const [builds, setBuilds] = useState(defaultBuilds);
  const [currentTab, setCurrentTab] = useState(tabs[0].key);
  const [showBuild, setShowBuild] = useState({ show: false, id: 0 });
  const hideBuildPopup = useCallback(
    () => setShowBuild({ show: false, id: showBuild.id }),
    [],
  );
  const showBuildPopup = useCallback(
    (id: number) => setShowBuild({ show: true, id }),
    [],
  );

  const [showCombo, setShowCombo] = useState(false);
  const showComboPopup = useCallback(() => setShowCombo(true), []);
  const hideComboPopup = useCallback(() => setShowCombo(false), []);

  const findBuild = (id: number) => {
    return builds.find((build) => build.id === id);
  };

  const categorizedBuilds = useMemo(() => {
    return builds.reduce<{
      building: IBuild[];
      event: IBuild[];
      employee: IBuild[];
    }>(
      (res, next) => {
        res[next.type].push(next);
        return res;
      },
      { building: [], event: [], employee: [] },
    );
  }, [builds]);

  const buildToShow = useMemo(() => {
    // we don't care if `show` is true or false to prevent flickering
    return findBuild(showBuild.id);
  }, [builds, showBuild]);

  useEffect(() => {
    // fetch data and put it into the state.
  }, []);

  const onUpgrade = useCallback(
    (id: number) => {
      hideBuildPopup();
      const build = findBuild(id);
      if (build) {
        // TODO: when implementing business logic, think about how we can reuse this logic.
        setBuilds(
          builds.map((build) =>
            build.id === id
              ? { ...build, level: build.level + 1, cost: build.cost * 10 }
              : build,
          ),
        );
      } else {
        Toast.show({
          icon: "fail",
          content: "Build not found!",
        });
      }
    },
    [builds],
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
              onClick={showBuildPopup}
            />
          ))}
        </div>
      </section>
      <Popup
        visible={showBuild.show}
        position="bottom"
        onMaskClick={hideBuildPopup}
        onClose={hideBuildPopup}
        bodyClassName={styles.buildPopup}
      >
        <BuildPopup build={buildToShow} onAction={onUpgrade} />
      </Popup>
      <Popup
        visible={showCombo}
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
          color="primary"
        >
          Okay!
        </Button>
      </Popup>
    </>
  );
}
