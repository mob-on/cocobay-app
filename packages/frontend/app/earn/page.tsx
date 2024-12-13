"use client";

import { useHideLoading } from "@hooks/useHideLoading";
import usePopup from "@hooks/usePopup";
import NumberFormatter from "@lib/NumberFormatter";
import gift from "@media/gift.svg";
import PopupContents from "@src/components/PopupContents";
import ButtonComponent from "@src/components/shared/Button";
import Card from "@src/components/shared/Card";
import Cost from "@src/components/shared/Cost";
import Coin from "@src/components/svg/Coin";
import styles from "@src/styles/pages/earn.module.css";
import Popup from "antd-mobile/es/components/popup";
import { CheckCircleFill, RightOutline } from "antd-mobile-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type EarnTask = {
  id: string;
  name: string;
  description: string;
  iconSrc: string;
  reward: number;
  completed?: boolean;
  // TODO: think about other values we might want
};

const defaultTasks: EarnTask[] = [
  {
    id: "0",
    name: "Get to level 2",
    description: "Get to level 2",
    iconSrc: gift,
    reward: 10000,
    completed: true,
  },
  {
    id: "1",
    name: "Invite 3 friends",
    description: "Get to level 2",
    iconSrc: gift,
    reward: 250000,
    completed: false,
  },
];

export default function Earn() {
  useHideLoading();
  const [taskList] = useState(defaultTasks);
  const [popupState, _showPopup, hidePopup] = usePopup();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/builds");
    router.prefetch("/earn/daily-rewards");
    router.prefetch("/friends");
  }, [router]);

  const currentTask = useMemo(() => {
    return (
      taskList.find((task) => task.id === popupState.id) || ({} as EarnTask)
    );
  }, [taskList, popupState.id]);

  const showPopup = useCallback(
    (id: string) => {
      _showPopup(id);
    },
    [_showPopup],
  );

  return (
    <>
      <section id="earn" className={styles.earn}>
        <div className={styles.earnMore}>
          <Coin className={styles.coin} />
          <h1>Earn more coins</h1>
        </div>
        <Link href="/earn/daily-rewards" className={styles.link}>
          <Card type="custom" onClick={() => {}} variant="special">
            <>
              <Image
                src={gift}
                alt="Daily reward"
                className={styles.gift}
                height={96}
                width={96}
                priority
              />
              <h2>Daily reward</h2>
              <RightOutline width={24} height={24} />
            </>
          </Card>
        </Link>
        <section className={styles.tasks}>
          <h2>Tasks list</h2>
          <div className={styles.taskList}>
            {defaultTasks.map((task) => (
              <Card
                key={task.id}
                type="custom"
                onClick={() => {
                  showPopup(task.id);
                }}
              >
                <>
                  <Image
                    src={task.iconSrc}
                    alt="Daily reward"
                    className={styles.gift}
                    height={64}
                    width={64}
                    priority
                  />
                  <h3 style={{ marginRight: "auto" }}>{task.name}</h3>
                  {task.completed ? (
                    <CheckCircleFill width={32} height={32} />
                  ) : (
                    <RightOutline width={24} height={24} />
                  )}
                </>
              </Card>
            ))}
          </div>
        </section>
      </section>
      <Popup
        visible={popupState.show}
        position="bottom"
        onMaskClick={hidePopup}
        onClose={hidePopup}
        bodyClassName={styles.popup}
      >
        <PopupContents>
          <>
            <h2>{currentTask.name}</h2>
            <p>{currentTask.description}</p>
            {currentTask.completed ? (
              <p>You already have this!</p>
            ) : (
              <Cost>{NumberFormatter.format(currentTask.reward)}</Cost>
            )}
            <ButtonComponent onClick={hidePopup} color="gradient">
              {currentTask.completed ? "Okay" : "Claim"}
            </ButtonComponent>
          </>
        </PopupContents>
      </Popup>
    </>
  );
}
