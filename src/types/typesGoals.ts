import { Timestamp } from "firebase/firestore";

export interface Goal {
  id: string;
  title: string;
  timeframe: number;
  createdAt: Timestamp;
  completed: boolean;
  userId:string;
}