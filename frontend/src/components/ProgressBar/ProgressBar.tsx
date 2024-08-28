import React from 'react';
import styles from 'src/styles/components/progressBar.module.scss';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className={styles.progressBar}>
      <div className={styles.progress} style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default ProgressBar;
