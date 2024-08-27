import React from 'react';
import Link from 'next/link';
import styles from 'src/styles/components/menu/button.module.scss';

interface IMenuButtonProps {
    text: string;
    path: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isSelected: boolean;
}

const MenuButton: React.FC<IMenuButtonProps> = (props: IMenuButtonProps) => {
    const { Icon } = props;
    return (
        <Link href={props.path} className={styles.button + ` ${props.isSelected ? styles.selected : ''}`}>
            <Icon className={styles.icon} />
            <p>{props.text}</p>
        </Link>
    );
};

export default MenuButton;
