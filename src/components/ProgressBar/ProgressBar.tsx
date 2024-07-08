// ProgressBar.tsx

import React from 'react';
import styles from '../../styles/ProgressBar.module.scss'; // Adjust the import as per your styling approach

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
