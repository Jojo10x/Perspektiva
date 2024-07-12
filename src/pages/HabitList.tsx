import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  query,
  where,
  onSnapshot,
  deleteDoc
} from "firebase/firestore";
import { db ,auth} from "../../Firebase-config";
import styles from "../styles/components/Habits/HabitList.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { daysOfWeek } from '../types/constants';
import Link from "next/link";
import { User, onAuthStateChanged} from "firebase/auth";
import Modal from "@/components/common/Modal/Modal";
import Loader from "@/components/common/Loader/Loader";

interface Habit {
    id: string;
    name: string;
    dailyHours: number[];
    completedHours: number[];
    createdAt: Timestamp; 
    userId:string;
  }
  
const HabitList = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState<{
    message: string;
    type: "success" | "error" | "confirm";
    habitId?: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchHabits(user.uid);
      } else {
        setHabits([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchHabits = (uid: string) => {
    const habitsCollection = collection(db, "habits");
    const q = query(habitsCollection, where("userId", "==", uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const habitsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];
      setHabits(habitsData);
      setLoading(false);
    });

    return unsubscribe;
  };

  const calculateTotalHoursPerWeek = (
    dailyHours: number[],
    completedHours: number[]
  ) => {
    return dailyHours.reduce((acc, hours) => acc + hours, 0);
  };

  const calculateCompletedHoursPerWeek = (completedHours: number[]) => {
    return completedHours.reduce((acc, hours) => acc + hours, 0);
  };

  const calculateTotalHoursPerMonth = (
    dailyHours: number[],
    completedHours: number[]
  ) => {
    return calculateTotalHoursPerWeek(dailyHours, completedHours) * 4;
  };

  const handleDailyHoursChange = async (
    habitIndex: number,
    dayIndex: number,
    value: number
  ) => {
    const updatedHabits = [...habits];
    updatedHabits[habitIndex].dailyHours[dayIndex] = value;

    const habitDocRef = doc(db, "habits", updatedHabits[habitIndex].id);
    await updateDoc(habitDocRef, {
      dailyHours: updatedHabits[habitIndex].dailyHours,
    });

    setHabits(updatedHabits);
  };

  const handleCompleteHoursChange = async (
    habitIndex: number,
    dayIndex: number,
    value: number
  ) => {
    const updatedHabits = [...habits];
    updatedHabits[habitIndex].completedHours[dayIndex] = value;

    const habitDocRef = doc(db, "habits", updatedHabits[habitIndex].id);
    await updateDoc(habitDocRef, {
      completedHours: updatedHabits[habitIndex].completedHours,
    });

    setHabits(updatedHabits);
  };

  const confirmDeleteHabit = (habitId: string) => {
    setModalInfo({
      message: "Are you sure you want to delete this habit?",
      type: "confirm",
      habitId: habitId,
    });
  };

  const handleDeleteHabit = async () => {
    if (modalInfo?.habitId) {
      try {
        await deleteDoc(doc(db, "habits", modalInfo.habitId));
        setModalInfo({
          message: "Habit deleted successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Error deleting habit: ", error);
        setModalInfo({
          message: "Failed to delete habit. Please try again.",
          type: "error",
        });
      }
    }
  };

  const incrementDailyHours = (habitIndex: number, dayIndex: number) => {
    handleDailyHoursChange(
      habitIndex,
      dayIndex,
      habits[habitIndex].dailyHours[dayIndex] + 1
    );
  };

  const decrementDailyHours = (habitIndex: number, dayIndex: number) => {
    if (habits[habitIndex].dailyHours[dayIndex] > 0) {
      handleDailyHoursChange(
        habitIndex,
        dayIndex,
        habits[habitIndex].dailyHours[dayIndex] - 1
      );
    }
  };

  const incrementCompletedHours = (habitIndex: number, dayIndex: number) => {
    handleCompleteHoursChange(
      habitIndex,
      dayIndex,
      habits[habitIndex].completedHours[dayIndex] + 1
    );
  };

  const decrementCompletedHours = (habitIndex: number, dayIndex: number) => {
    if (habits[habitIndex].completedHours[dayIndex] > 0) {
      handleCompleteHoursChange(
        habitIndex,
        dayIndex,
        habits[habitIndex].completedHours[dayIndex] - 1
      );
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
    const startOfWeek = new Date(
      startDate.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000
    );
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

  const closeModal = () => {
    setModalInfo(null);
  };

  if (loading) {
    return (
      <div className={styles.loader_container}>
        <Loader/>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumb />
      <ul className={styles.habitList}>
        {habits.map((habit, habitIndex) => {
          const weekNumber = calculateWeekNumber(habit.createdAt);
          return (
            <li key={habit.id} className={styles.habitItem}>
              <button onClick={() => confirmDeleteHabit(habit.id)}>
                Delete Habit
              </button>
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
                            onClick={() =>
                              decrementDailyHours(habitIndex, dayIndex)
                            }
                            className={styles.decrementButton}
                          >
                            -
                          </button>
                          <span>{habit.dailyHours[dayIndex]} hours</span>
                          <button
                            type="button"
                            onClick={() =>
                              incrementDailyHours(habitIndex, dayIndex)
                            }
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
                    <div
                      key={weekIndex}
                      className={styles.habitItem__progress_bar}
                    >
                      <div
                        className={styles.habitItem__progress}
                        style={{
                          width: `${
                            calculateTotalHoursPerWeek(
                              habit.dailyHours,
                              habit.completedHours
                            ) > 0
                              ? (calculateCompletedHoursPerWeek(
                                  habit.completedHours
                                ) /
                                  calculateTotalHoursPerWeek(
                                    habit.dailyHours,
                                    habit.completedHours
                                  )) *
                                100
                              : 0
                          }%`,
                        }}
                      >
                        <span className={styles.habitItem__progress__label}>
                          {calculateTotalHoursPerWeek(
                            habit.dailyHours,
                            habit.completedHours
                          ) > 0
                            ? `${Math.round(
                                (calculateCompletedHoursPerWeek(
                                  habit.completedHours
                                ) /
                                  calculateTotalHoursPerWeek(
                                    habit.dailyHours,
                                    habit.completedHours
                                  )) *
                                  100
                              )}%`
                            : "0%"}
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
        {modalInfo && (
          <Modal
            message={modalInfo.message}
            type={modalInfo.type}
            onClose={closeModal}
            onConfirm={
              modalInfo.type === "confirm" ? handleDeleteHabit : undefined
            }
          />
        )}
      </ul>
      <Link href="/habits" className={styles.plans__history_button}>
        <span>Go Back</span>
      </Link>
    </div>
  );
};
  
  export default HabitList;
