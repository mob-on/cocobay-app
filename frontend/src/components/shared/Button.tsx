import { Button } from "antd-mobile";
import styles from "src/styles/components/shared/button.module.scss";

export type IButtonColors = "gradient" | "primary";

// Wrap this to have easy access to both standard and custom buttons
// via antd mobile button
const ButtonComponent: React.FC<{
  onClick: React.EventHandler<React.MouseEvent>;
  color?: IButtonColors;
  className?: string;
  children?: React.ReactNode;
  value?: string;
  fill?: "solid" | "outline";
}> = ({ onClick, className, children, color = "primary", fill = "solid" }) => {
  return (
    <Button
      onClick={onClick}
      className={className + ` ${styles[color]} ${styles.button}`}
      block
      fill={fill}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
