"use client";

import FriendsList from "@src/components/Friends/FriendsList";
import { useFriends } from "@src/shared/context/FriendsContext";
import styles from "@src/styles/pages/friends/friends-all.module.css";
import React from "react";

const FriendsAll = () => {
  const { friends } = useFriends();
  return (
    <section id="friends-all" className={styles.friends}>
      <h1>Your friends</h1>
      <FriendsList friends={friends} />
    </section>
  );
};

export default FriendsAll;
