import React from 'react';
import styles from "../../styles/components/Habits/HabitList.module.scss";
import { calculateTotalHoursPerWeek, calculateCompletedHoursPerWeek } from '../../utils/habitUtils';

interface ProgressBarProps {
  weekIndex: number;
  start: string;
  end: string;
  dailyHours: number[];
  completedHours: number[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ weekIndex, start, end, dailyHours, completedHours }) => {
  const totalHours = calculateTotalHoursPerWeek(dailyHours, completedHours);
  const completedHoursWeek = calculateCompletedHoursPerWeek(completedHours);
  const progressPercentage = totalHours > 0 ? (completedHoursWeek / totalHours) * 100 : 0;

  return (
    <div className={styles.habitItem__progress_bar}>
      <div
        className={styles.habitItem__progress}
        style={{ width: `${progressPercentage}%` }}
      >
        <span className={styles.habitItem__progress__label}>
          {Math.round(progressPercentage)}%
        </span>
      </div>
      <span>
        Week {weekIndex + 1}: {start} - {end}
      </span>
    </div>
  );
};

export default ProgressBar;