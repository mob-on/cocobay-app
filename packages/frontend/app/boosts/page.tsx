"use client";

import { Boost } from "@shared/src/interfaces";
import BoostPopup from "@src/components/Boosts/BoostPopup";
import Card from "@src/components/shared/Card";
import { useBoosts } from "@src/shared/context/BoostsContext";
import usePopup from "@src/shared/hooks/usePopup";
import styles from "@src/styles/pages/home/boosts.module.css";
import { Popup, Toast } from "antd-mobile";
import { useCallback, useMemo } from "react";

export default function Boosts() {
  const { boosts } = useBoosts();
  const [boostPopupState, showBoostPopup, hideBoostPopup] = usePopup();
  const findBoost = useCallback(
    (id: string) => {
      return boosts.find((boost) => boost.id === id);
    },
    [boosts],
  );

  const { daily, regular } = useMemo(() => {
    if (!boosts.length)
      return {
        daily: [],
        regular: [],
      };
    return boosts.reduce<{
      daily: Boost[];
      regular: Boost[];
      boostToShow: Boost;
    }>(
      (res, next) => {
        res[next.type].push(next);
        return res;
      },
      { daily: [], regular: [], boostToShow: {} as Boost },
    );
  }, [boosts]);

  const boostToShow = useMemo(() => {
    // we don't care if `show` is true or false to prevent flickering
    return findBoost(boostPopupState.id ?? "") || ({} as Boost);
  }, [boostPopupState, findBoost]);

  const onUpgrade = useCallback(
    (id: string) => {
      hideBoostPopup();
      const boost = findBoost(id);
      if (boost) {
        // TODO: make boosts service and call it.
        // boostService.upgradeBoost(boost);
        // lock this boost in the meantime. Wait for server asnwer, call dispatch in the service.
        // on error, show error popup, otherwise show success animation
      } else {
        Toast.show({
          icon: "fail",
          content: "Boost not found!",
        });
      }
    },
    [findBoost, hideBoostPopup],
  );

  const onClaim = useCallback(
    (id: string) => {
      hideBoostPopup();
      const boost = findBoost(id);
      if (boost) {
        if (boost.maxToday - boost.usedToday <= 0) {
          return;
        }
        // same logic as onUpgrade, but it should be boostService.claimBoost
      } else {
        Toast.show({
          icon: "fail",
          content: "Boost not found!",
        });
      }
    },
    [findBoost, hideBoostPopup],
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
