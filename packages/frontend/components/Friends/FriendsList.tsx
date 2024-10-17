import NumberFormatter from "@lib/NumberFormatter";
import type { Friend } from "@shared/src/interfaces";
import styles from "@src/styles/components/friends/friendsList.module.css";
import Avatar from "antd-mobile/es/components/avatar";

import Card from "../shared/Card";
import Cost from "../shared/Cost";

const FriendsList: React.FC<{ friends: Friend[]; className?: string }> = ({
  friends,
  className,
}) => {
  return (
    <div className={styles.friendsList + " " + className}>
      {friends.map((friend) => {
        return (
          <Card key={friend.id} className={styles.friend}>
            <>
              <Avatar src={friend.avatarSrc} />
              <div className={styles.friendInfo}>
                <p className={styles.name}>{friend.username}</p>
                <p className={styles.taps}>
                  <Cost cost={friend.progress.points} />
                </p>
              </div>
              <Cost position="right" size={20} className={styles.reward}>
                <span className={styles.rewardText}>
                  +{NumberFormatter.format(friend.collectedReward)}
                </span>
              </Cost>
            </>
          </Card>
        );
      })}
    </div>
  );
};

export default FriendsList;
