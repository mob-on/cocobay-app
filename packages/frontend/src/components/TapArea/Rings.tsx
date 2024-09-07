import React from "react";
import styles from "src/styles/components/tapArea/rings.module.scss";

/**
 * Component that renders rings and background gradients around the Coco image.
 */
const Rings: React.FC = () => {
  return (
    <div className={styles.ringsMain}>
      <div className={styles.bg} />
      <div className={styles.ringBg} />
      <div className={styles.ring1} />
      <div id="tap-ring2" className={styles.ring2} />
      <div id="tap-ring3" className={styles.ring3} />
    </div>
  );
};

export default Rings;
