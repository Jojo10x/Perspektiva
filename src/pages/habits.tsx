import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, { useState } from 'react';
import styles from "../styles/Habit.module.scss";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where,Timestamp } from "firebase/firestore";
import { db,auth } from '../../Firebase-config';
import Link from 'next/link';
import "./globals.css";
import { daysOfWeek } from '../types/constants';
import Modal from '@/components/Modal/Modal';

interface Habit {
  name: string;
  dailyHours: number[];
  completedHours: number[];
  createdAt: Timestamp;
  userId:string;
}

interface StoredHabit extends Habit {
  id: string;
  
 
}

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<StoredHabit[]>([]);
  const [habitName, setHabitName] = useState('');
  const [dailyHours, setDailyHours] = useState<number[]>(Array(7).fill(0));
  const [modalInfo, setModalInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  

  const handleAddHabit = async () => {
    const user = auth.currentUser;
    if (habitName && dailyHours.some(hours => hours > 0) && user) {
      const newHabit: Habit = {
        name: habitName,
        dailyHours,
        completedHours: Array(7).fill(0),
        createdAt: Timestamp.now(),
        userId: user.uid
      };

      try {
        await addDoc(collection(db, 'habits'), newHabit);
        setHabitName('');
        setDailyHours(Array(7).fill(0));
        setModalInfo({ message: 'Habit added successfully!', type: 'success' });
      } catch (error) {
        console.error("Error adding habit: ", error);
        setModalInfo({ message: 'Failed to add habit. Please try again.', type: 'error' });
      }
    }else {
      setModalInfo({ message: 'Please enter a habit name and at least one daily hour.', type: 'error' });
    }
  };

  const calculateTotalHoursPerWeek = (dailyHours: number[], completedHours: number[]) => {
    return dailyHours.reduce((acc, hours, index) => acc + (hours - completedHours[index]), 0);
  };

  const calculateTotalHoursPerMonth = (dailyHours: number[], completedHours: number[]) => {
    return calculateTotalHoursPerWeek(dailyHours, completedHours) * 4;
  };

  const handleCompleteHoursChange = (habitIndex: number, dayIndex: number, value: number) => {
    const updatedHabits = [...habits];
    updatedHabits[habitIndex].completedHours[dayIndex] = value;
    setHabits(updatedHabits);
  };
  const closeModal = () => {
    setModalInfo(null);
  };

  return (
    <div className={styles.container}>
      <Breadcrumb />
      <div className={styles.card}>
        <h1 className={styles.title}>Habit Tracker</h1>
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
            <input
              type="number"
              value={dailyHours[index]}
              onChange={(e) => {
                const newDailyHours = [...dailyHours];
                newDailyHours[index] = e.target.value ? Number(e.target.value) : 0;
                setDailyHours(newDailyHours);
              }}
              className={styles.input}
            />
          </div>
        ))}
        <button onClick={handleAddHabit} className={styles.button}>
          Add Habit
        </button>
        <div className={styles.habitsSection}>
          <h2 className={styles.subtitle}>Habits</h2>
          <ul className={styles.habitList}>
            {habits.map((habit, habitIndex) => (
              <li key={habitIndex} className={styles.habitItem}>
                <div className={styles.habitContent}>
                  <span className={styles.habitName}>{habit.name}</span>
                  <div className={styles.daysGrid}>
                    {daysOfWeek.map((day, dayIndex) => (
                      <div key={dayIndex} className={styles.dayRow}>
                        <span className={styles.dayName}>{day}:</span>
                        <div className={styles.hoursInput}>
                          <span>{habit.dailyHours[dayIndex]} hours</span>
                          <input
                            type="number"
                            value={habit.completedHours[dayIndex]}
                            onChange={(e) =>
                              handleCompleteHoursChange(habitIndex, dayIndex, e.target.value ? Number(e.target.value) : 0)
                            }
                            className={styles.completedInput}
                          />
                          <span>completed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.totalHours}>
                    <div>
                      <span>Total weekly hours:</span>
                      <span>{calculateTotalHoursPerWeek(habit.dailyHours, habit.completedHours)} hours</span>
                    </div>
                    <div>
                      <span>Total monthly hours:</span>
                      <span>{calculateTotalHoursPerMonth(habit.dailyHours, habit.completedHours)} hours</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {modalInfo && (
        <Modal message={modalInfo.message} type={modalInfo.type} onClose={closeModal} />
      )}
        <div className="flex space-x-4">
        <Link href="/habitlist" className={styles.plans__history_button}>
        <span>Habit List</span>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default HabitTracker;
