import { Avatar } from "antd-mobile";
import Card from "../shared/Card";
import { IFriend } from "./Friends";
import styles from "src//styles/components/friends/friendsList.module.scss";
import Cost from "../shared/Cost";
import NumberFormatter from "src//shared/lib/NumberFormatter";

const FriendsList: React.FC<{ friends: IFriend[]; className?: string }> = ({
  friends,
  className,
}) => {
  return (
    <div className={styles.friendsList + " " + className}>
      {friends.map((friend) => {
        return (
          <Card key={friend.id} className={styles.friend}>
            <>
              <Avatar src={friend.imgSrc} />
              <div className={styles.friendInfo}>
                <p className={styles.name}>{friend.name}</p>
                <p className={styles.taps}>
                  <Cost cost={friend.progress.taps} />
                </p>
              </div>
              <Cost position="right" size={20} className={styles.reward}>
                <span className={styles.rewardText}>
                  +{NumberFormatter.format(friend.reward)}
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
