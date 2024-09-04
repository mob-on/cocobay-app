import { Avatar } from "antd-mobile";
import axios from "axios";
import Hero from "public/media/coco/coco-pink-swag.svg";
import React, { useEffect, useState } from "react";
import styles from "src/styles/components/main/homeAvatar.module.scss";

export interface IHomeAvatarData {
  src: string;
  name: string;
}

const defaultAvatarData: IHomeAvatarData = {
  src: Hero,
  name: "John Doe",
};

const HomeAvatar: React.FC = () => {
  const [data, setData] = useState(defaultAvatarData);
  const { name, src } = data;

  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((response) => {
        setData({
          src: data.src,
          name: `${response.data}, John Doe!`,
        });
      })
      .catch((e: unknown) => {
        console.error("Unable to connect to backend", e);
      });
  }, []);

  return (
    <div className={styles.homeAvatar}>
      <Avatar src={src} />
      <p className={styles.name}>{name}</p>
    </div>
  );
};

export default HomeAvatar;
