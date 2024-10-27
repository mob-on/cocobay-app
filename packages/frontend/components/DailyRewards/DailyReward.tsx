import NumberFormatter from "@lib/NumberFormatter";
import styles from "@styles/components/dailyRewards/dailyReward.module.css";
import Image from "next/image";

import Card from "../shared/Card";
import Cost from "../shared/Cost";
import { type IDailyReward } from "./DailyRewards";

const DailyReward: React.FC<{
  reward: IDailyReward;
  weekDay: number;
  disabled?: boolean;
}> = ({ reward, weekDay, disabled }) => {
  if (!reward.isSpecial && !reward.amount) {
    throw new Error("Regular cards should have an amount!");
  }
  if (reward.isSpecial && !reward.image) {
    throw new Error("Special rewards should have an image!");
  }

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

        {reward.isSpecial && reward.image && (
          <>
            <Image
              src={reward.image}
              alt={reward.title || "Reward"}
              width={64}
              height={64}
              className={styles.specialRewardImage}
              priority
            />
            <div className={styles.specialRewardBg} />
          </>
        )}
        {!reward.isSpecial && reward.amount && (
          <Cost>{NumberFormatter.format(reward.amount)}</Cost>
        )}
      </>
    </Card>
  );
};

export default DailyReward;
