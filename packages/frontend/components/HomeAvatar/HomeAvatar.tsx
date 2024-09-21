"use client";

import Hero from "@media/coco/coco-pink-swag.svg";
import { useUserData } from "@src/shared/context/UserContext";
import styles from "@src/styles/components/main/homeAvatar.module.scss";
import Avatar from "antd-mobile/es/components/avatar";
import React from "react";

export interface IHomeAvatarData {
  src: string;
  name: string;
}

const HomeAvatar: React.FC = () => {
  const { data } = useUserData();
  const { firstName, lastName, avatar } = data;

  return (
    <div className={styles.homeAvatar}>
      <Avatar src={avatar ?? Hero} />
      <p className={styles.name}>
        {firstName} {lastName}
      </p>
    </div>
  );
};

export default HomeAvatar;
