import React, { useCallback, useMemo, useState } from "react";
import Card from "src//components/shared/Card";
import styles from "src//styles/pages/earn.module.scss";
import Image from "next/image";
import gift from "/public/media/gift.svg";
import { CheckCircleFill, RightOutline } from "antd-mobile-icons";
import Link from "next/link";
import coin from "/public/media/coco-coin.svg";
import { Popup } from "antd-mobile";
import usePopup from "src//shared/hooks/usePopup";
import PopupContents from "src//components/PopupContents";
import ButtonComponent from "src//components/shared/Button";
import Cost from "src//components/shared/Cost";
import NumberFormatter from "src//shared/lib/NumberFormatter";

interface IEarnTask {
  id: number;
  name: string;
  description: string;
  iconSrc: string;
  reward: number;
  completed?: boolean;
  // TODO: think about other values we might want
}

const defaultTasks: IEarnTask[] = [
  {
    id: 0,
    name: "Get to level 2",
    description: "Get to level 2",
    iconSrc: gift,
    reward: 10000,
    completed: true,
  },
  {
    id: 1,
    name: "Invite 3 friends",
    description: "Get to level 2",
    iconSrc: gift,
    reward: 250000,
    completed: false,
  },
];

export default function Earn() {
  const [taskList] = useState(defaultTasks);
  const [popupState, _showPopup, hidePopup] = usePopup();

  const currentTask = useMemo(() => {
    return taskList.find((task) => task.id === popupState.id);
  }, [taskList, popupState.id]);

  const showPopup = useCallback(
    (id: number) => {
      _showPopup(id);
    },
    [currentTask.id],
  );

  return (
    <>
      <section id="earn" className={styles.earn}>
        <div className={styles.earnMore}>
          <Image
            src={coin}
            alt="Earn more"
            className={styles.coin}
            width={128}
            height={128}
            priority
          />
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
