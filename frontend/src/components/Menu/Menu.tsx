import HomeIcon from 'public/media/icons/home.svg';
import BuildIcon from 'public/media/icons/build.svg';
import EarnIcon from 'public/media/icons/earn.svg';
import FriendsIcon from 'public/media/icons/friends.svg';
// import AirdropIcon from 'public/media/icons/airdrop.svg';

import styles from "src/styles/components/menu/menu.module.scss";
import Button from './Button';
import { useRouter } from 'next/router';

/**
* Renders a menu with buttons for each page. The current page button is highlighted.
*/
const Menu: React.FC = () => {
  const { pathname } = useRouter();
  const isRoot = pathname === '/';
  const buttons = [
    {
      text: "Home",
      path: "/",
      iconPath: HomeIcon,
    },
    {
      text: "Build",
      path: "/build",
      iconPath: BuildIcon,
    },
    {
      text: "Earn",
      path: "/earn",
      iconPath: EarnIcon,
    },
    {
      text: "Friends",
      path: "/friends",
      iconPath: FriendsIcon,
    },
    // {
    //     text: "Airdrop",
    //     path: "/airdrop",
    //     iconPath: AirdropIcon,
    // },
  ];
  
  return (
    <div className={styles.main}>
    <div className={styles.menu}>
    {buttons.map(button => 
      <Button isSelected={!isRoot ? pathname === button.path : pathname.startsWith(button.path)} key={button.text} {...button} />
    )}
    </div>
    </div>
  );
};

export default Menu;