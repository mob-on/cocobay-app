import { SpinLoading } from "antd-mobile";
import hero from "frontend/public/media/coco/coco-pink-swag.svg";
import styles from "frontend/src/styles/components/loadingScreen/loadingScreen.module.scss";
import Image from "next/image";
import Logo from "frontend/public/media/logo.svg";
import grid from "frontend/public/media/grid.svg";
import cloud1 from "frontend/public/media/cloud-white1.svg";
import cloud2 from "frontend/public/media/cloud-white2.svg";
import cloud3 from "frontend/public/media/cloud-white3.svg";

const LoadingScreen: React.FC = () => {
  return (
    <div className={styles.loadingScreen}>
      <Image
        className={styles.hero}
        src={hero}
        alt="Hero image"
        width="256"
        height="256"
      />
      <Image
        src={Logo}
        alt="logo"
        width="258"
        height="35"
        className={styles.logo}
      />
      <h1 className={styles.slogan}>We came to play</h1>
      <SpinLoading className={styles.loading} color="primary" />;
      <Image
        priority
        id="__grid-loading"
        src={grid}
        width={1}
        height={1}
        alt="Grid"
      />
      <div className={styles.clouds}>
        <Image
          className={styles.cloud + " " + styles.cloud1}
          src={cloud1}
          alt="Cloud"
          width={64}
          height={64}
        />
        <Image
          className={styles.cloud + " " + styles.cloud2}
          src={cloud2}
          alt="Cloud"
          width={64}
          height={64}
        />
        <Image
          className={styles.cloud + " " + styles.cloud3}
          src={cloud3}
          alt="Cloud"
          width={64}
          height={64}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
