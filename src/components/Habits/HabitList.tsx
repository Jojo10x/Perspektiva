// components/HabitItem.tsx
import React from 'react';
import styles from "../../styles/components/Habits/HabitList.module.scss";
import { Habit } from '../../types/typesHabitList';
import { daysOfWeek } from '../../types/constants';
import { calculateTotalHoursPerWeek, calculateTotalHoursPerMonth, calculateWeekNumber, calculateStartEndDate, formatDate } from '../../utils/habitUtils';
import ProgressBar from '../../components/Habits/ProgressBar';
interface HabitItemProps {
  habit: Habit;
  habitIndex: number;
  onDeleteHabit: (habitId: string) => void;
  onDailyHoursChange: (habitIndex: number, dayIndex: number, value: number) => void;
  onCompleteHoursChange: (habitIndex: number, dayIndex: number, value: number) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ 
  habit, 
  habitIndex, 
  onDeleteHabit, 
  onDailyHoursChange, 
  onCompleteHoursChange 
}) => {
  const weekNumber = calculateWeekNumber(habit.createdAt);

  const decrementDailyHours = (habitIndex: number, dayIndex: number) => {
    const newValue = habit.dailyHours[dayIndex] - 1;
    onDailyHoursChange(habitIndex, dayIndex, newValue < 0 ? 0 : newValue);
  };

  const incrementDailyHours = (habitIndex: number, dayIndex: number) => {
    const newValue = habit.dailyHours[dayIndex] + 1;
    onDailyHoursChange(habitIndex, dayIndex, newValue);
  };

  const decrementCompletedHours = (habitIndex: number, dayIndex: number) => {
    const newValue = habit.completedHours[dayIndex] - 1;
    onCompleteHoursChange(habitIndex, dayIndex, newValue < 0 ? 0 : newValue);
  };

  const incrementCompletedHours = (habitIndex: number, dayIndex: number) => {
    const newValue = habit.completedHours[dayIndex] + 1;
    onCompleteHoursChange(habitIndex, dayIndex, newValue);
  };

  const handleCompleteHoursChange = (habitIndex: number, dayIndex: number, value: number) => {
    onCompleteHoursChange(habitIndex, dayIndex, value);
  };

  return (
    <li className={styles.habitItem}>
      <button onClick={() => onDeleteHabit(habit.id)}>Delete Habit</button>
      <div className={styles.habitContent}>
        <span className={styles.habitName}>{habit.name}</span>
        <span className={styles.habitDate}>
          Created At: {formatDate(habit.createdAt)}
        </span>
        <div className={styles.daysGrid}>
          {daysOfWeek.map((day, dayIndex) => (
            <div key={dayIndex} className={styles.dayRow}>
              <span className={styles.dayName}>{day}:</span>
              <div className={styles.hoursInput}>
                <div className={styles.inputGroup}>
                  <button
                    type="button"
                    onClick={() => decrementDailyHours(habitIndex, dayIndex)}
                    className={styles.decrementButton}
                  >
                    -
                  </button>
                  <span>{habit.dailyHours[dayIndex]} hours</span>
                  <button
                    type="button"
                    onClick={() => incrementDailyHours(habitIndex, dayIndex)}
                    className={styles.incrementButton}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className={styles.hoursInput}>
                <span>Completed:</span>
                <div className={styles.inputGroup}>
                  <button
                    type="button"
                    onClick={() =>
                      decrementCompletedHours(habitIndex, dayIndex)
                    }
                    className={styles.decrementButton}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={habit.completedHours[dayIndex]}
                    onChange={(e) =>
                      handleCompleteHoursChange(
                        habitIndex,
                        dayIndex,
                        e.target.value ? Number(e.target.value) : 0
                      )
                    }
                    className={styles.completedInput}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      incrementCompletedHours(habitIndex, dayIndex)
                    }
                    className={styles.incrementButton}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.totalHours}>
          <div>
            <span>Total weekly hours:</span>
            <span>
              {calculateTotalHoursPerWeek(
                habit.dailyHours,
                habit.completedHours
              )}{" "}
              hours
            </span>
          </div>
          <div>
            <span>Total monthly hours:</span>
            <span>
              {calculateTotalHoursPerMonth(
                habit.dailyHours,
                habit.completedHours
              )}{" "}
              hours
            </span>
          </div>
        </div>
        {Array.from({ length: weekNumber }).map((_, weekIndex) => {
          const { start, end } = calculateStartEndDate(
            habit.createdAt,
            weekIndex
          );
          return (
            <ProgressBar
              key={weekIndex}
              weekIndex={weekIndex}
              start={start}
              end={end}
              dailyHours={habit.dailyHours}
              completedHours={habit.completedHours}
            />
          );
        })}
      </div>
    </li>
  );
};

export default HabitItem;