import React from 'react';
import styles from "../../../styles/components/Habits/Habit.module.scss";
import { daysOfWeek } from '../../../types/constants';
import Button from '@/components/common/Button/Button';
import DynamicSlider from '../../common/Slider/DynamicSlider';

interface HabitFormProps {
  habitName: string;
  setHabitName: (name: string) => void;
  dailyHours: number[];
  handleDailyHoursChange: (dayIndex: number, value: number) => void;
  handleAddHabit: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
  habitName,
  setHabitName,
  dailyHours,
  handleDailyHoursChange,
  handleAddHabit
}) => (
  <>
    <div className={styles.inputGroup}>
      <label className={styles.label}>Habit Name</label>
      <input
        type="text"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        className={styles.input}
      />
    </div>
    {daysOfWeek.map((day, index) => (
      <div className={styles.inputGroup} key={day}>
        <label className={styles.label}>{day}</label>
        <DynamicSlider
          value={dailyHours[index]}
          onChange={(value) => handleDailyHoursChange(index, value)}
          max={24}
        />
        <span className={styles.hoursDisplay}>{dailyHours[index]} hours</span>
      </div>
    ))}
    <Button content='Habits' className={styles.button} onClick={handleAddHabit}>
      Add Habit
    </Button>
  </>
);

export default HabitForm;