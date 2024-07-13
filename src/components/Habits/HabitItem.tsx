import React from 'react';
import styles from "../../styles/components/Habits/Habit.module.scss";
import { daysOfWeek } from '../../types/constants';
import DynamicSlider from '../../components/common/Slider/DynamicSlider';
import { StoredHabit } from '../../types/typesHabit';

interface HabitItemProps {
  habit: StoredHabit;
  handleCompleteHoursChange: (habitIndex: number, dayIndex: number, value: number) => void;
  habitIndex: number;
  calculateTotalHoursPerWeek: (dailyHours: number[], completedHours: number[]) => number;
  calculateTotalHoursPerMonth: (dailyHours: number[], completedHours: number[]) => number;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  handleCompleteHoursChange,
  habitIndex,
  calculateTotalHoursPerWeek,
  calculateTotalHoursPerMonth
}) => (
  <li className={styles.habitItem}>
    <div className={styles.habitContent}>
      <span className={styles.habitName}>{habit.name}</span>
      <div className={styles.daysGrid}>
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className={styles.dayRow}>
            <span className={styles.dayName}>{day}:</span>
            <DynamicSlider
              value={habit.completedHours[dayIndex]}
              onChange={(value) => handleCompleteHoursChange(habitIndex, dayIndex, value)}
              max={habit.dailyHours[dayIndex]}
            />
            <span className={styles.hoursDisplay}>
              {habit.completedHours[dayIndex]}/{habit.dailyHours[dayIndex]} hours
            </span>
          </div>
        ))}
      </div>
      <div className={styles.totalHours}>
        <div>
          <span>Total weekly hours:</span>
          <span>
            {calculateTotalHoursPerWeek(habit.dailyHours, habit.completedHours)} hours
          </span>
        </div>
        <div>
          <span>Total monthly hours:</span>
          <span>
            {calculateTotalHoursPerMonth(habit.dailyHours, habit.completedHours)} hours
          </span>
        </div>
      </div>
    </div>
  </li>
);

export default HabitItem;