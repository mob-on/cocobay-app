"use client";

import Hero from "@media/coco/coco-pink-swag.svg";
import useTelegram from "@src/hooks/useTelegram";
import styles from "@src/styles/components/main/homeAvatar.module.css";
import Avatar from "antd-mobile/es/components/avatar";
import React from "react";

export interface IHomeAvatarData {
  src: string;
  name: string;
}

const HomeAvatar: React.FC = () => {
  const [WebApp] = useTelegram();
  const { user } = WebApp?.initDataUnsafe;
  if (!user) return <></>;
  const { username, photo_url, first_name } = user;
  return (
    <div className={styles.homeAvatar}>
      <Avatar src={photo_url ?? Hero.src} />
      <p className={styles.name}>{username ?? first_name}</p>
    </div>
  );
};

export default HomeAvatar;
