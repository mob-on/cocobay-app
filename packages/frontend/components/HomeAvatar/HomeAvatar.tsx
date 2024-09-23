"use client";

import Hero from "@media/coco/coco-pink-swag.svg";
import { useUserData } from "@src/shared/context/UserContext";
import styles from "@src/styles/components/main/homeAvatar.module.css";
import Avatar from "antd-mobile/es/components/avatar";
import React from "react";

export interface IHomeAvatarData {
  src: string;
  name: string;
}

const HomeAvatar: React.FC = () => {
  const { data } = useUserData();
  console.log(data);
  const { username, firstName, avatarSrc } = data;
  console.log(avatarSrc, Hero);
  return (
    <div className={styles.homeAvatar}>
      <Avatar src={avatarSrc ?? Hero.src} />
      <p className={styles.name}>{username ?? firstName}</p>
    </div>
  );
};

export default HomeAvatar;
