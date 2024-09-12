import styles from "frontend/src/styles/components/popupContents/popupContents.module.scss";

interface PopupContentsProps {
  children?: JSX.Element;
  direction?: "row" | "column";
  className?: string;
}

const PopupContents: React.FC<PopupContentsProps> = ({
  children,
  direction = "column",
  className,
}) => {
  return (
    <div
      className={styles.popupContents + " " + className}
      style={{ flexDirection: direction }}
    >
      {children}
    </div>
  );
};

export default PopupContents;
