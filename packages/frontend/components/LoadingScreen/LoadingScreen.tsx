import styles from "@src/styles/components/loadingScreen/loadingScreen.module.css";
import SpinLoading from "antd-mobile/es/components/spin-loading";

import * as Clouds from "../svg/Clouds";
import Grid from "../svg/Grid";
import Hero from "../svg/Hero";
import Logo from "../svg/Logo";

const LoadingScreen: React.FC = () => {
  return (
    <div className={styles.loadingScreen}>
      <Hero className={styles.hero} />
      <Logo className={styles.logo} />
      <h1 className={styles.slogan}>We came to play</h1>
      <SpinLoading className={styles.loading} color="primary" />;
      <Grid id="__grid-loading" />
      <div className={styles.clouds}>
        <Clouds.White1 className={styles.cloud + " " + styles.cloud1} />
        <Clouds.White2 className={styles.cloud + " " + styles.cloud2} />
        <Clouds.White3 className={styles.cloud + " " + styles.cloud3} />
      </div>
    </div>
  );
};

export default LoadingScreen;
