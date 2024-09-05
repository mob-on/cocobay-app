import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "src/styles/pages/home/boosts.module.scss";

import { Popup, Toast } from "antd-mobile";
import energy from "public/media/icons/energy.svg";
import { IBoost } from "src/components/Boosts";
import BoostPopup from "src/components/Boosts/BoostPopup";
import usePopup from "src/shared/hooks/usePopup";
import Card from "src/components/shared/Card";
import usePopup from "src/shared/hooks/usePopup";

const defaultBoosts: IBoost[] = [
  {
    id: 1,
    name: "Replenish energy",
    description: "Get your energy back to full, one energy drink at a time",
    iconSrc: energy,
    cost: 1000,
    level: null,
    maxLevel: 1,
    type: "daily",
    usedToday: 5,
    maxToday: 6,
  },
  {
    id: 2,
    name: "Boost 1",
    description: "Boost 2 description",
    iconSrc: energy,
    cost: 10000,
    level: 5,
    type: "regular",
    usedToday: 0,
    maxToday: Infinity,
    maxLevel: 5,
  },
  {
    id: 3,
    name: "Boost 3",
    description: "Boost 3 description",
    iconSrc: energy,
    cost: 10000,
    level: 2,
    type: "regular",
    usedToday: 1,
    maxToday: Infinity,
    maxLevel: 5,
    cooldownUntil: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes, for testing
  },
];

export default function Boosts() {
  const [boosts, setBoosts] = useState(defaultBoosts);
  const [boostPopupState, showBoostPopup, hideBoostPopup] = usePopup();

  const findBoost = (id: number) => {
    return boosts.find((boost) => boost.id === id);
  };

  const { daily, regular } = useMemo(() => {
    return boosts.reduce<{
      daily: IBoost[];
      regular: IBoost[];
      boostToShow: IBoost;
    }>(
      (res, next) => {
        res[next.type].push(next);
        return res;
      },
      { daily: [], regular: [], boostToShow: null },
    );
  }, [boosts]);

  const boostToShow = useMemo(() => {
    // we don't care if `show` is true or false to prevent flickering
    return findBoost(boostPopupState.id);
  }, [boosts, boostPopupState]);

  useEffect(() => {
    // fetch data and put it into the state.
    setBoosts([
      ...defaultBoosts,
      {
        id: 4,
        name: "Boost 4",
        description: "Boost 4 description",
        iconSrc: energy,
        cost: 1000,
        level: 1,
        type: "regular",
        usedToday: 0,
        maxToday: Infinity,
        maxLevel: 5,
      },
    ]);
  }, []);

  const onUpgrade = useCallback(
    (id: number) => {
      hideBoostPopup();
      const boost = findBoost(id);
      if (boost) {
        setBoosts(
          boosts.map((boost) =>
            boost.id === id
              ? { ...boost, level: boost.level + 1, cost: boost.cost * 10 }
              : boost,
          ),
        );
      } else {
        Toast.show({
          icon: "fail",
          content: "Boost not found!",
        });
      }
    },
    [boosts],
  );

  const onClaim = useCallback(
    (id: number) => {
      hideBoostPopup();
      const boost = findBoost(id);
      if (boost) {
        if (boost.maxToday - boost.usedToday <= 0) {
          return;
        }
        setBoosts(
          boosts.map((boost) =>
            boost.id === id
              ? { ...boost, usedToday: boost.usedToday + 1 }
              : boost,
          ),
        );
      } else {
        Toast.show({
          icon: "fail",
          content: "Boost not found!",
        });
      }
    },
    [boosts],
  );

  return (
    <>
      <section id="boosts" className={styles.boosts}>
        <h2>Boosts</h2>
        {daily.length ? (
          <div className={styles.boostType}>
            <h3>Daily Boosts</h3>
            <div className={styles.boostList}>
              {daily.map((boost) => (
                <Card
                  onClick={() => showBoostPopup(boost.id)}
                  key={boost.id}
                  data={boost}
                  type="boost"
                />
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
        {regular.length ? (
          <div className={styles.boostType}>
            <h3>Upgrades</h3>
            <div className={styles.boostList}>
              {regular.map((boost) => (
                <Card
                  onClick={() => showBoostPopup(boost.id)}
                  key={boost.id}
                  data={boost}
                  type="boost"
                />
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
      </section>
      <Popup
        visible={boostPopupState.show}
        position="bottom"
        onMaskClick={hideBoostPopup}
        onClose={hideBoostPopup}
        bodyClassName={styles.boostPopup}
      >
        <BoostPopup
          boost={boostToShow}
          onAction={boostToShow?.type === "daily" ? onClaim : onUpgrade}
        />
      </Popup>
    </>
  );
}
