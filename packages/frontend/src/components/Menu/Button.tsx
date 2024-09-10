import React from "react";
import Link from "next/link";
import styles from "src/styles/components/menu/button.module.scss";
import Image from "next/image";

interface IMenuButtonProps {
  text: string;
  path: string;
  iconPath: string;
  isSelected: boolean;
}

const MenuButton: React.FC<IMenuButtonProps> = (props: IMenuButtonProps) => {
  const { iconPath } = props;
  return (
    <Link
      href={props.path}
      className={styles.button + ` ${props.isSelected ? styles.selected : ""}`}
    >
      <Image
        src={iconPath}
        alt={props.text}
        width="29"
        height="29"
        className={styles.icon}
        priority
      />
      <p>{props.text}</p>
    </Link>
  );
};

export default MenuButton;
