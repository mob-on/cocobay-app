import React, { useEffect, useMemo, useState } from "react";
import gift from "/public/media/gift.svg";
import Image from "next/image";
import styles from "src//styles/pages/daily-rewards.module.scss";
import Week from "src//components/DailyRewards/Week";
import { IDailyReward, IDailyRewards } from "src//components/DailyRewards";
import DailyReward from "src//components/DailyRewards/DailyReward";
import Button from "src//components/shared/Button";

const DAILY_AWARD_COUNT = 7;
const REWARDS_PER_ROW = 4;

const defaultDailyRewards: IDailyRewards = {
  current: 1,
  rewardList: [],
};

const DailyRewards: React.FC = () => {
  const [rewards, setRewards] = useState(defaultDailyRewards);
  useEffect(() => {
    // temporary data
    const tempRewards: IDailyReward[] = [];
    for (let i = 0; i < DAILY_AWARD_COUNT; i++) {
      tempRewards.push({
        id: i,
        title: `Day ${i + 1}`,
        amount: 1000 + 5000 * i,
        day: i,
        isSpecial: (i + 1) % 7 === 0,
        description: `Something special!`,
        image: gift,
      });
    }
    setRewards((prev) => ({ ...prev, rewardList: tempRewards }));
  }, []);

  const rewardRows = useMemo(() => {
    const rows: IDailyReward[][] = [];
    for (let i = 0; i < rewards.rewardList.length; i += REWARDS_PER_ROW) {
      rows.push(rewards.rewardList.slice(i, i + REWARDS_PER_ROW));
    }
    return rows;
  }, [rewards]);
  const currentWeek = Math.ceil(rewards.current / 7);
  return (
    <>
      <section id="daily-rewards" className={styles.dailyRewards}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Daily Rewards</h1>
            <p>
              Claim your daily rewards by logging into the game daily without
              skipping
            </p>
          </div>
          <Image
            src={gift}
            alt="Daily Reward"
            className={styles.gift}
            width={96}
            height={96}
            priority
          />
        </header>
        <div className={styles.weeks}>
          {[1, 2, 3].map((week) => (
            <Week
              week={week}
              isActive={week === currentWeek}
              isFinished={week < currentWeek}
              key={week}
            />
          ))}
        </div>
        <div className={styles.rewardList}>
          {rewardRows.map((row, i) => {
            return (
              <div key={i} className={styles.rewardRow}>
                {row.map((reward, j) => {
                  const currentIndex = i * REWARDS_PER_ROW + j;
                  const disabled = currentIndex > rewards.current;
                  return (
                    <DailyReward
                      disabled={disabled}
                      key={j}
                      weekDay={currentIndex + 1 - 7 * j}
                      reward={reward}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <Button onClick={() => {}} color="gradient" className={styles.button}>
          Claim
        </Button>
      </section>
    </>
  );
};

export default DailyRewards;
