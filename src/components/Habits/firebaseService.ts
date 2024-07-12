import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from '../../../Firebase-config';

export const addHabitToFirebase = async (habitName: string, dailyHours: number[]) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  const newHabit = {
    name: habitName,
    dailyHours,
    completedHours: Array(7).fill(0),
    createdAt: Timestamp.now(),
    userId: user.uid
  };

  await addDoc(collection(db, 'habits'), newHabit);
};