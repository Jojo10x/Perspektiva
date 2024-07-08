import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "../../Firebase-config";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import styles from "../styles/HabitList.module.scss";
import { format, isSameDay, isSameWeek, isSameMonth } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { daysOfWeek } from '../types/constants';

interface Habit {
    id: string;
    name: string;
    dailyHours: number[];
    completedHours: number[];
    createdAt: Timestamp; 
  }
  
const HabitList = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchHabits = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'habits'));
          const habitsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Habit[];
          setHabits(habitsData);
        } catch (error) {
          console.error('Error fetching habits: ', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchHabits();
    }, []);
  
    const calculateTotalHoursPerWeek = (dailyHours: number[], completedHours: number[]) => {
      return dailyHours.reduce((acc, hours) => acc + hours, 0);
    };
  
    const calculateCompletedHoursPerWeek = (completedHours: number[]) => {
      return completedHours.reduce((acc, hours) => acc + hours, 0);
    };
  
    const calculateTotalHoursPerMonth = (dailyHours: number[], completedHours: number[]) => {
      return calculateTotalHoursPerWeek(dailyHours, completedHours) * 4;
    };

    const handleDailyHoursChange = async (habitIndex: number, dayIndex: number, value: number) => {
      const updatedHabits = [...habits];
      updatedHabits[habitIndex].dailyHours[dayIndex] = value;
  
      const habitDocRef = doc(db, 'habits', updatedHabits[habitIndex].id);
      await updateDoc(habitDocRef, {
        dailyHours: updatedHabits[habitIndex].dailyHours
      });
  
      setHabits(updatedHabits);
    };
  
    const handleCompleteHoursChange = async (habitIndex: number, dayIndex: number, value: number) => {
      const updatedHabits = [...habits];
      updatedHabits[habitIndex].completedHours[dayIndex] = value;
  
      const habitDocRef = doc(db, 'habits', updatedHabits[habitIndex].id);
      await updateDoc(habitDocRef, {
        completedHours: updatedHabits[habitIndex].completedHours
      });
  
      setHabits(updatedHabits);
    };
  
    const incrementDailyHours = (habitIndex: number, dayIndex: number) => {
      handleDailyHoursChange(habitIndex, dayIndex, habits[habitIndex].dailyHours[dayIndex] + 1);
    };
  
    const decrementDailyHours = (habitIndex: number, dayIndex: number) => {
      if (habits[habitIndex].dailyHours[dayIndex] > 0) {
        handleDailyHoursChange(habitIndex, dayIndex, habits[habitIndex].dailyHours[dayIndex] - 1);
      }
    };
  
    const incrementCompletedHours = (habitIndex: number, dayIndex: number) => {
      handleCompleteHoursChange(habitIndex, dayIndex, habits[habitIndex].completedHours[dayIndex] + 1);
    };
  
    const decrementCompletedHours = (habitIndex: number, dayIndex: number) => {
      if (habits[habitIndex].completedHours[dayIndex] > 0) {
        handleCompleteHoursChange(habitIndex, dayIndex, habits[habitIndex].completedHours[dayIndex] - 1);
      }
    };

    const calculateWeekNumber = (createdAt: Timestamp) => {
      const startDate = createdAt.toDate();
      const currentDate = new Date();
      const diffInMs = currentDate.getTime() - startDate.getTime();
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) + 1; 
    };
  
    const calculateStartEndDate = (createdAt: Timestamp, weekIndex: number) => {
      const startDate = createdAt.toDate();
      const startOfWeek = new Date(startDate.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000);
      const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
      return {
        start: startOfWeek.toLocaleDateString(),
        end: endOfWeek.toLocaleDateString(),
      };
    };

    const formatDate = (timestamp: Timestamp) => {
      const date = timestamp.toDate();
      return date.toLocaleDateString();
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className={styles.container}>
      <Breadcrumb />
      <ul className={styles.habitList}>
        {habits.map((habit, habitIndex) => {
          const weekNumber = calculateWeekNumber(habit.createdAt);
          return (
            <li key={habit.id} className={styles.habitItem}>
              <div className={styles.habitContent}>
                <span className={styles.habitName}>{habit.name}</span>
                <span className={styles.habitDate}>Created At: {formatDate(habit.createdAt)}</span>
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
                            onClick={() => decrementCompletedHours(habitIndex, dayIndex)}
                            className={styles.decrementButton}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={habit.completedHours[dayIndex]}
                            onChange={(e) =>
                              handleCompleteHoursChange(habitIndex, dayIndex, e.target.value ? Number(e.target.value) : 0)
                            }
                            className={styles.completedInput}
                          />
                          <button
                            type="button"
                            onClick={() => incrementCompletedHours(habitIndex, dayIndex)}
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
                    <span>{calculateTotalHoursPerWeek(habit.dailyHours, habit.completedHours)} hours</span>
                  </div>
                  <div>
                    <span>Total monthly hours:</span>
                    <span>{calculateTotalHoursPerMonth(habit.dailyHours, habit.completedHours)} hours</span>
                  </div>
                </div>
                {Array.from({ length: weekNumber }).map((_, weekIndex) => {
                  const { start, end } = calculateStartEndDate(habit.createdAt, weekIndex);
                  return (
                    <div key={weekIndex} className={styles.habitItem__progress_bar}>
                      <div
                        className={styles.habitItem__progress}
                        style={{
                          width: `${
                            calculateTotalHoursPerWeek(habit.dailyHours, habit.completedHours) > 0
                              ? (calculateCompletedHoursPerWeek(habit.completedHours) /
                                  calculateTotalHoursPerWeek(habit.dailyHours, habit.completedHours)) *
                                100
                              : 0
                          }%`,
                        }}
                      >
                        <span className={styles.habitItem__progress__label}>
                          {calculateTotalHoursPerWeek(habit.dailyHours, habit.completedHours) > 0
                            ? `${Math.round(
                                (calculateCompletedHoursPerWeek(habit.completedHours) /
                                  calculateTotalHoursPerWeek(habit.dailyHours, habit.completedHours)) *
                                  100
                              )}%`
                            : '0%'}
                        </span>
                      </div>
                      <span>
                        Week {weekIndex + 1}: {start} - {end}
                      </span>
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
      <Link href="/habit" className={styles.plans__history_button}>
        <span>Habit</span>
      </Link>
    </div>
  );
};
  
  export default HabitList;
