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
  disabled?: boolean;
}> = ({
  onClick,
  className = "",
  children,
  color = "primary",
  fill = "solid",
  style,
  disabled = false,
}) => {
  console.log(color, styles.button, styles[color]);
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className={
        className +
        ` ${styles[color]} ${styles.button} ${disabled && styles.disabled}`
      }
      block
      style={style}
      fill={fill}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
