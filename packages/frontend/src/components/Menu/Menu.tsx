import { useRouter } from "next/router";
import { useLoading } from "src/shared/context/LoadingContext";
import styles from "src/styles/components/menu/menu.module.scss";

import BuildIcon from "/public/media/icons/build.svg";
import EarnIcon from "/public/media/icons/earn.svg";
import FriendsIcon from "/public/media/icons/friends.svg";
import HomeIcon from "/public/media/icons/home.svg";

import MenuButton from "./MenuButton";

/**
 * Renders a menu with buttons for each page. The current page button is highlighted.
 */
const Menu: React.FC = () => {
  const { allLoaded } = useLoading();
  const { pathname } = useRouter();
  const isRoot = pathname === "/";
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
  ];

  return (
    <div
      style={{ display: allLoaded ? "flex" : "none" }}
      className={styles.main}
    >
      <div className={styles.menu}>
        {buttons.map((button) => (
          <MenuButton
            isSelected={
              !isRoot
                ? pathname === button.path
                : pathname.startsWith(button.path)
            }
            key={button.text}
            {...button}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
