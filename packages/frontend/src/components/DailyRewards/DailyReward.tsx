import NumberFormatter from "@src/shared/lib/NumberFormatter";
import styles from "@src/styles/components/dailyRewards/dailyReward.module.scss";
import Image from "next/image";

import Card from "../shared/Card";
import Cost from "../shared/Cost";
import { IDailyReward } from "./DailyRewards";

const DailyReward: React.FC<{
  reward: IDailyReward;
  weekDay: number;
  disabled?: boolean;
}> = ({ reward, weekDay, disabled }) => {
  return (
    <Card
      className={
        styles.dailyReward + (reward.isSpecial ? " " + styles.special : "")
      }
      disabled={disabled}
    >
      <>
        <div className={styles.text}>
          <span>{reward.title || `Day ${weekDay}`}</span>
          {reward.isSpecial && (
            <>
              <br />
              <span className={styles.description}>{reward.description}</span>
            </>
          )}
        </div>

        {reward.isSpecial && (
          <>
            <Image
              src={reward.image}
              alt={reward.title}
              width={64}
              height={64}
              className={styles.specialRewardImage}
              priority
            />
            <div className={styles.specialRewardBg} />
          </>
        )}
        {!reward.isSpecial && (
          <Cost>{NumberFormatter.format(reward.amount)}</Cost>
        )}
      </>
    </Card>
  );
};

export default DailyReward;
