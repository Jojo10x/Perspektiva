import { Timestamp } from "firebase/firestore";

export const calculateTotalHoursPerWeek = (dailyHours: number[], completedHours: number[]) => {
  return dailyHours.reduce((acc, hours) => acc + hours, 0);
};

export const calculateCompletedHoursPerWeek = (completedHours: number[]) => {
  return completedHours.reduce((acc, hours) => acc + hours, 0);
};

export const calculateTotalHoursPerMonth = (dailyHours: number[], completedHours: number[]) => {
  return calculateTotalHoursPerWeek(dailyHours, completedHours) * 4;
};

export const calculateWeekNumber = (createdAt: Timestamp) => {
  const startDate = createdAt.toDate();
  const currentDate = new Date();
  const diffInMs = currentDate.getTime() - startDate.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) + 1;
};

export const calculateStartEndDate = (createdAt: Timestamp, weekIndex: number) => {
  const startDate = createdAt.toDate();
  const startOfWeek = new Date(startDate.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000);
  const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  return {
    start: startOfWeek.toLocaleDateString(),
    end: endOfWeek.toLocaleDateString(),
  };
};

export const formatDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  return date.toLocaleDateString();
};