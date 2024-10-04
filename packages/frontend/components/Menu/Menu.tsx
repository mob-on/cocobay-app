import BuildIcon from "@media/icons/build.svg";
import EarnIcon from "@media/icons/earn.svg";
import FriendsIcon from "@media/icons/friends.svg";
import HomeIcon from "@media/icons/home.svg";
import { useResources } from "@src/shared/context/ResourcesContext";
import styles from "@src/styles/components/menu/menu.module.css";
import { usePathname } from "next/navigation";

import MenuButton from "./MenuButton";

/**
 * Renders a menu with buttons for each page. The current page button is highlighted.
 */
const Menu: React.FC = () => {
  const { allLoaded } = useResources();
  const pathname = usePathname();
  const isRoot = pathname === "/";
  const buttons = [
    {
      text: "Home",
      path: "/home",
      iconPath: HomeIcon,
    },
    {
      text: "Build",
      path: "/builds",
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
  console.log(pathname, buttons);
  return (
    <div className={styles.menu}>
      {buttons.map((button) => (
        <MenuButton
          isSelected={pathname.startsWith(button.path)}
          key={button.text}
          {...button}
        />
      ))}
    </div>
  );
};

export default Menu;
