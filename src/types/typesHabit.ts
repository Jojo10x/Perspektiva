import { Timestamp } from "firebase/firestore";

export interface Habit {
  name: string;
  dailyHours: number[];
  completedHours: number[];
  createdAt: Timestamp;
  userId: string;
}

export interface StoredHabit extends Habit {
  id: string;
}