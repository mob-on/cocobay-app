import styles from "@src/styles/components/shared/button.module.css";
import Button from "antd-mobile/es/components/button";

export type IButtonColors = "gradient" | "primary" | "secondary";

// Wrap this to have easy access to both standard and custom buttons
// via antd mobile button
const ButtonComponent: React.FC<{
  onClick: React.EventHandler<React.MouseEvent>;
  color?: IButtonColors;
  className?: string;
  children?: React.ReactNode;
  value?: string;
  style?: React.CSSProperties;
  fill?: "solid" | "outline";
}> = ({
  onClick,
  className,
  children,
  color = "primary",
  fill = "solid",
  style,
}) => {
  return (
    <Button
      onClick={onClick}
      className={className + ` ${styles[color]} ${styles.button}`}
      block
      style={style}
      fill={fill}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
