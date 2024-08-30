import React, { useEffect, useState } from "react";
import styles from 'src/styles/components/main/homeAvatar.module.scss';
import Hero from 'public/media/coco/coco-pink-swag.svg';
import { Avatar } from "antd-mobile";

export interface IHomeAvatarData {
  src: string,
  name: string,
};

const defaultAvatarData: IHomeAvatarData = {
  src: Hero,
  name: 'John Doe',
};

const HomeAvatar: React.FC = () => {
  const [ data, setData ] = useState(defaultAvatarData)
  const { name, src } = data;

  useEffect(() => {
    // fetch data and put it into the state.
    setData({
      src: data.src,
      name: 'Jean Doe',
    })
  }, []);

  return (
    <div className={styles.homeAvatar}>
      <Avatar src={src} />
      <p className={styles.name}>{ name }</p>
    </div>
  );  
};

export default HomeAvatar;