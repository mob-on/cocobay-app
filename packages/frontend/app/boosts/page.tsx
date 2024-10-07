"use client";

import usePopup from "@hooks/usePopup";
import type {
  Boost,
  ClaimableBoost,
  UpgradeableBoost,
} from "@shared/src/interfaces";
import BoostPopup from "@src/components/Boosts/BoostPopup";
import Card from "@src/components/shared/Card";
import { useBoosts } from "@src/contexts/Boosts";
import { useErrorContext } from "@src/contexts/Errors";
import styles from "@src/styles/pages/home/boosts.module.css";
import { Popup, Toast } from "antd-mobile";
import { useCallback, useMemo } from "react";

export default function Boosts() {
  const { boosts } = useBoosts();
  const errorContext = useErrorContext();
  const [boostPopupState, showBoostPopup, hideBoostPopup] = usePopup();
  const findBoost = useCallback(
    (id: string) => {
      return boosts.find((boost) => boost.id === id);
    },
    [boosts],
  );

  const { claimable, upgradeable } = useMemo(() => {
    if (!boosts.length)
      return {
        claimable: [],
        upgradeable: [],
      };
    return boosts.reduce<{
      claimable: ClaimableBoost[];
      upgradeable: UpgradeableBoost[];
      boostToShow: Boost;
    }>(
      (res, next) => {
        switch (next.type) {
          case "claimable":
            res.claimable.push(next as ClaimableBoost);
            break;
          case "upgradeable":
            res.upgradeable.push(next as UpgradeableBoost);
            break;
        }
        return res;
      },
      { claimable: [], upgradeable: [], boostToShow: {} as Boost },
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
      const boost: ClaimableBoost = findBoost(id) as ClaimableBoost;
      if (!(boost.type === "claimable")) {
        errorContext.showErrorScreen({
          message: "Something went wrong when claiming boost!",
          dismissable: true,
        });
      }
      if (boost) {
        if (boost.max - boost.used <= 0) {
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
        <h1>Boosts</h1>
        {claimable.length ? (
          <div className={styles.boostType}>
            <h3>Daily Boosts</h3>
            <div className={styles.boostList}>
              {claimable.map((boost) => (
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
        {upgradeable.length ? (
          <div className={styles.boostType}>
            <h3>Upgrades</h3>
            <div className={styles.boostList}>
              {upgradeable.map((boost) => (
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
          onAction={boostToShow?.type === "claimable" ? onClaim : onUpgrade}
        />
      </Popup>
    </>
  );
}
