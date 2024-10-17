"use client";

import { useFriends } from "@contexts/GameData";
import { useHideLoading } from "@hooks/useHideLoading";
import FriendsList from "@src/components/Friends/FriendsList";
import styles from "@styles/pages/friends/friends-all.module.css";
import React from "react";

const FriendsAll = () => {
  useHideLoading();
  const friends = useFriends();
  return (
    <section id="friends-all" className={styles.friends}>
      <h1>Your friends</h1>
      <FriendsList friends={friends} />
    </section>
  );
};

export default FriendsAll;
