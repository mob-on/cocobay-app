"use client";

import Hero from "@media/coco/coco-pink-swag.svg";
import styles from "@src/styles/components/main/homeAvatar.module.scss";
import Avatar from "antd-mobile/es/components/avatar";
import React, { useState } from "react";

export interface IHomeAvatarData {
  src: string;
  name: string;
}

const defaultAvatarData: IHomeAvatarData = {
  src: Hero,
  name: "John Doe",
};

const HomeAvatar: React.FC = () => {
  const [data] = useState(defaultAvatarData);
  const { name, src } = data;

  return (
    <div className={styles.homeAvatar}>
      <Avatar src={src} />
      <p className={styles.name}>{name}</p>
    </div>
  );
};

export default HomeAvatar;
