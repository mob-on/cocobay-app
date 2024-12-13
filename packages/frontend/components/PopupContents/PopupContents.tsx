import styles from "@src/styles/components/popupContents/popupContents.module.css";

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
