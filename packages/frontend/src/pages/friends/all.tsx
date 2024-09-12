import React from "react";
import { defaultFriends, IFriend } from "frontend/src/components/Friends";
import FriendsList from "frontend/src/components/Friends/FriendsList";
import styles from "frontend/src/styles/pages/friends/friends-all.module.css";

const FriendsAll = () => {
  const [friends] = React.useState<IFriend[]>(defaultFriends);
  return (
    <section id="friends-all" className={styles.friends}>
      <h1>Your friends</h1>
      <FriendsList friends={friends} />
    </section>
  );
};

export default FriendsAll;
