import {
    collection,
    getDocs,
    doc,
    updateDoc,
    query,
    where,
    onSnapshot,
    deleteDoc
  } from "firebase/firestore";
  import { db } from "../../Firebase-config";
  import { Habit } from "../types/typesHabitList";
  
  export const fetchHabits = (uid: string, setHabits: (habits: Habit[]) => void, setLoading: (loading: boolean) => void) => {
    const habitsCollection = collection(db, "habits");
    const q = query(habitsCollection, where("userId", "==", uid));
  
    return onSnapshot(q, (querySnapshot) => {
      const habitsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];
      setHabits(habitsData);
      setLoading(false);
    });
  };
  
  export const updateHabitHours = async (habitId: string, field: "dailyHours" | "completedHours", hours: number[]) => {
    const habitDocRef = doc(db, "habits", habitId);
    await updateDoc(habitDocRef, { [field]: hours });
  };
  
  export const deleteHabit = async (habitId: string) => {
    await deleteDoc(doc(db, "habits", habitId));
  };