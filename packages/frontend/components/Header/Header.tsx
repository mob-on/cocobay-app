import Logo from "@media/logo.svg";
import styles from "@src/styles/components/header.module.scss";
import { LeftOutline } from "antd-mobile-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

// We don't really need this, because telegram does it's own header, but maybe it would be useful down the line
const Header: React.FC = () => {
  const router = useRouter();
  return (
    <div className={styles.fixedWrapper}>
      <header id="header" className={styles.main} role="banner">
        <LeftOutline
          onClick={() => router.back()}
          className={styles.back}
          role="button"
        />
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
