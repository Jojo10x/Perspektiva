import { Timestamp } from "firebase/firestore";

export interface Habit {
  id: string;
  name: string;
  dailyHours: number[];
  completedHours: number[];
  createdAt: Timestamp; 
  userId: string;
}