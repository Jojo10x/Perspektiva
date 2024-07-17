import Breadcrumb from '@/components/common/Breadcrumbs/Breadcrumb';
import React, { useState } from 'react';
import styles from "../styles/components/Habits/Habit.module.scss";
import Link from 'next/link';
import "./globals.css";
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import dynamic from 'next/dynamic';
import HabitForm from '../components/Forms/Habits/HabitForm';
import HabitItem from '../components/Habits/HabitItem';
import { useHabitTracker } from '../hooks/useHabitTracker';


const HabitTracker: React.FC = () => {
  const {
    habits,
    habitName,
    setHabitName,
    dailyHours,
    modalInfo,
    handleAddHabit,
    handleDailyHoursChange,
    handleCompleteHoursChange,
    closeModal
  } = useHabitTracker();

  const calculateTotalHoursPerWeek = (dailyHours: number[], completedHours: number[]) => {
    return dailyHours.reduce((acc, hours, index) => acc + (hours - completedHours[index]), 0);
  };

  const calculateTotalHoursPerMonth = (dailyHours: number[], completedHours: number[]) => {
    return calculateTotalHoursPerWeek(dailyHours, completedHours) * 4;
  };

  return (
    <div className={styles.container}>
      <Breadcrumb />
      <div className={styles.card}>
        <h1 className={styles.title}>Habit Tracker</h1>
        <HabitForm
          habitName={habitName}
          setHabitName={setHabitName}
          dailyHours={dailyHours}
          handleDailyHoursChange={handleDailyHoursChange}
          handleAddHabit={handleAddHabit}
        />
        <div className={styles.habitsSection}>
          <ul className={styles.habitList}>
            {habits.map((habit, habitIndex) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                habitIndex={habitIndex}
                handleCompleteHoursChange={handleCompleteHoursChange}
                calculateTotalHoursPerWeek={calculateTotalHoursPerWeek}
                calculateTotalHoursPerMonth={calculateTotalHoursPerMonth}
              />
            ))}
          </ul>
        </div>
        {modalInfo && (
          <Modal
            message={modalInfo.message}
            type={modalInfo.type}
            onClose={closeModal}
          />
        )}
        <div className="flex space-x-4">
          <Link href="/HabitList">
            <Button className={styles.plans__history_button} content="Habits">Habit List</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
