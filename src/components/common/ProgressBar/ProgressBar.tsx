import React from 'react';
import styles from '../../../styles/components/ProgressBar.module.scss'; 

interface ProgressBarProps {
  currentCompleted: number;
  previousCompleted: number;
  previousTotal: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    currentCompleted,
    previousCompleted,
    previousTotal,
  }) => {

    const percentage = previousTotal > 0 ? (currentCompleted / previousCompleted) * 100 : 0;
  
    return (
      <div className={styles.progress_bar}>
        <div
          className={styles.progress}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

export default ProgressBar;
