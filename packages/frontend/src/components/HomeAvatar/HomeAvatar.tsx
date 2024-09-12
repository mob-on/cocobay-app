import { Avatar } from "antd-mobile";
import Hero from "frontend/public/media/coco/coco-pink-swag.svg";
import React, { useState } from "react";
import styles from "frontend/src/styles/components/main/homeAvatar.module.scss";

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
