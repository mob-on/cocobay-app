import React from 'react';
import styles from 'src/styles/components/progressBar.module.scss';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  if(progress < 0 || progress > 100) {
      console.error(`Invalid progress value: ${progress}%`);
  }
  const progressValid = progress < 0 ? 0 : Math.min(100, progress);

  return (
    <div className={styles.progressBar}>
      <div className={styles.progress} style={{ width: `${progressValid}%` }}></div>
    </div>
  );
};

export default ProgressBar;
