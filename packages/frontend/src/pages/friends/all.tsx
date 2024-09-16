import { defaultFriends, IFriend } from "@src/components/Friends";
import FriendsList from "@src/components/Friends/FriendsList";
import styles from "@src/styles/pages/friends/friends-all.module.css";
import React from "react";

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
