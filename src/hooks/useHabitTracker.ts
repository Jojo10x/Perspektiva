import { useState } from 'react';
import { StoredHabit } from '../types/typesHabit';
import { addHabitToFirebase } from '../components/Habits/firebaseService';

export const useHabitTracker = () => {
  const [habits, setHabits] = useState<StoredHabit[]>([]);
  const [habitName, setHabitName] = useState('');
  const [dailyHours, setDailyHours] = useState<number[]>(Array(7).fill(0));
  const [modalInfo, setModalInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleAddHabit = async () => {
    if (habitName && dailyHours.some(hours => hours > 0)) {
      try {
        await addHabitToFirebase(habitName, dailyHours);
        setHabitName('');
        setDailyHours(Array(7).fill(0));
        setModalInfo({ message: 'Habit added successfully!', type: 'success' });
      } catch (error) {
        console.error("Error adding habit: ", error);
        setModalInfo({ message: 'Failed to add habit. Please try again.', type: 'error' });
      }
    } else {
      setModalInfo({ message: 'Please enter a habit name and at least one daily hour.', type: 'error' });
    }
  };

  const handleDailyHoursChange = (dayIndex: number, value: number) => {
    setDailyHours(prevHours => {
      const newHours = [...prevHours];
      newHours[dayIndex] = value;
      return newHours;
    });
  };

  const handleCompleteHoursChange = (habitIndex: number, dayIndex: number, value: number) => {
    setHabits(prevHabits => {
      const updatedHabits = [...prevHabits];
      updatedHabits[habitIndex] = {
        ...updatedHabits[habitIndex],
        completedHours: updatedHabits[habitIndex].completedHours.map(
          (hours, index) => index === dayIndex ? value : hours
        ),
      };
      return updatedHabits;
    });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  return {
    habits,
    habitName,
    setHabitName,
    dailyHours,
    modalInfo,
    handleAddHabit,
    handleDailyHoursChange,
    handleCompleteHoursChange,
    closeModal
  };
};