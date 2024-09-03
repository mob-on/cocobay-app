import React from "react";
import { LeftOutline } from "antd-mobile-icons";
import styles from "src/styles/components/header.module.scss";
import Logo from "public/media/logo.svg";
import { useRouter } from "next/router";
import Image from "next/image";

// We don't really need this, because telegram does it's own header, but maybe it would be useful down the line
const Header: React.FC = () => {
  const router = useRouter();
  return (
    <div className={styles.fixedWrapper}>
      <header id="header" className={styles.main}>
        <LeftOutline onClick={() => router.back()} className={styles.back} />
        <Image
          src={Logo}
          alt="logo"
          width="258"
          height="35"
          className={styles.logo}
        />
      </header>
    </div>
  );
};

export default Header;
