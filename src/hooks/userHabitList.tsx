import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase-config";
import { Habit } from "../types/typesHabitList";
import { fetchHabits, updateHabitHours, deleteHabit } from "../service/habitService";

export const useHabitManagement = () => {
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
        const unsubscribeHabits = fetchHabits(user.uid, setHabits, setLoading);
        return () => unsubscribeHabits();
      } else {
        setHabits([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDailyHoursChange = async (habitIndex: number, dayIndex: number, value: number) => {
    const updatedHabits = [...habits];
    updatedHabits[habitIndex].dailyHours[dayIndex] = value;
    await updateHabitHours(updatedHabits[habitIndex].id, "dailyHours", updatedHabits[habitIndex].dailyHours);
    setHabits(updatedHabits);
  };

  const handleCompleteHoursChange = async (habitIndex: number, dayIndex: number, value: number) => {
    const updatedHabits = [...habits];
    updatedHabits[habitIndex].completedHours[dayIndex] = value;
    await updateHabitHours(updatedHabits[habitIndex].id, "completedHours", updatedHabits[habitIndex].completedHours);
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
        await deleteHabit(modalInfo.habitId);
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

  const closeModal = () => {
    setModalInfo(null);
  };

  return {
    habits,
    loading,
    modalInfo,
    handleDailyHoursChange,
    handleCompleteHoursChange,
    confirmDeleteHabit,
    handleDeleteHabit,
    closeModal,
  };
};