import React from "react";
import { LeftOutline } from 'antd-mobile-icons';
import styles from 'src/styles/components/header.module.scss';
import Logo from 'public/media/logo.svg';
import { useRouter } from 'next/router';

// We don't really need this, because telegram does it's own header, but maybe it would be useful down the line
const Header = () => {
  const router = useRouter()
  return <div className={styles.fixedWrapper}>
    <header id="header" className={styles.main}>
      <LeftOutline onClick={() => router.back()} className={styles.back} />
      <Logo className={styles.logo} />
    </header>
  </div>;
};

export default Header;
