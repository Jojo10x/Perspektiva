import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth,db } from "../../Firebase-config";
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns';
import {Plan} from './types'
import { daysOfWeek } from "./constants";


type PlansState = { [key: string]: Plan[] };
export const useFirebasePlans = (currentWeek: { start: Date, end: Date }) => {
    const [user, setUser] = useState<any>(null);
    const [plans, setPlans] = useState<PlansState>({});
    const [favoritePlans, setFavoritePlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          fetchPlans(user.uid).then(() => setLoading(false));
        } else {
          setUser(null);
          setLoading(false);
        }
      });
    
      return () => unsubscribe();
    }, [currentWeek]);
    
  const fetchPlans = async (uid: string) => {
    if (!uid) return;
    const plansData: { [key: string]: Plan[] } = {};
    const favoritePlans: Plan[] = [];


    const weekQuery = query(
      collection(db, "plans"),
      where("uid", "==", uid),
      where("date", ">=", currentWeek.start),
      where("date", "<=", currentWeek.end)
    );
    const weekQuerySnapshot = await getDocs(weekQuery);
    weekQuerySnapshot.forEach((doc) => {
      const data = doc.data();
      const day = format(data.date.toDate(), "EEEE");
      if (!plansData[day]) plansData[day] = [];
      const plan: Plan = {
        id: doc.id,
        task: data.task,
        completed: data.completed,
        editing: false,
        newTask: data.task,
        starred: false,
      };
      plansData[day].push(plan);
      if (plan.starred) {
        favoritePlans.push(plan);
      }
    });

    const starredQuery = query(
      collection(db, "plans"),
      where("uid", "==", uid),
      where("starred", "==", true)
    );
    const starredQuerySnapshot = await getDocs(starredQuery);
    starredQuerySnapshot.forEach((doc) => {
      const data = doc.data();
      const plan: Plan = {
        id: doc.id,
        task: data.task,
        completed: data.completed,
        editing: false,
        newTask: data.task,
        starred: data.starred || false,
      };
      favoritePlans.push(plan);
    });

    setPlans(plansData);
    setFavoritePlans(favoritePlans);
  };

  const addPlan = async (day: string, task: string) => {
    const date = getDateForDay(day, currentWeek.start);
    const docRef = await addDoc(collection(db, "plans"), {
      day,
      task,
      completed: false,
      date,
      uid: user?.uid,
      starred: false,
    });
    setPlans((prevPlans) => {
      const updatedDay = [...(prevPlans[day] || []), {
        id: docRef.id,
        task,
        completed: false,
        editing: false,
        newTask: task,
        starred: false,
      }];
      return {
        ...prevPlans,
        [day]: updatedDay,
      };
    });
console.log("Current plans state:", plans);
  };
  const toggleStarPlan = async (day: string, planId: string) => {
    const plan = plans[day]?.find((p) => p.id === planId);

    if (!plan) {
      console.error(`Plan with id ${planId} not found for day ${day}`);
      return;
    }

    const updatedPlan = { ...plan, starred: !plan.starred };

    const docRef = doc(db, "plans", planId);
    await updateDoc(docRef, { starred: updatedPlan.starred });

    setPlans((prevPlans) => ({
      ...prevPlans,
      [day]: prevPlans[day].map((p) => (p.id === planId ? updatedPlan : p)),
    }));

    if (updatedPlan.starred) {
      setFavoritePlans([...favoritePlans, updatedPlan]);
    } else {
      setFavoritePlans(
        favoritePlans.filter((favPlan) => favPlan.id !== planId)
      );
    }
  };

  const addFavoritePlanToDay = (favoritePlan: Plan, day: string) => {
    addPlan(day, favoritePlan.task);
  };

  const completePlan = async (day: string, id: string, completed: boolean) => {
    const docRef = doc(db, "plans", id);
    await updateDoc(docRef, { completed: !completed });
    setPlans((prevPlans) => ({
      ...prevPlans,
      [day]: prevPlans[day].map((plan) =>
        plan.id === id ? { ...plan, completed: !completed } : plan
      ),
    }));
  };

  const deletePlan = async (day: string, id: string) => {
    const docRef = doc(db, "plans", id);
    await deleteDoc(docRef);
    setPlans((prevPlans) => ({
      ...prevPlans,
      [day]: prevPlans[day].filter((plan) => plan.id !== id),
    }));
  };

  const editPlan = (day: string, id: string) => {
    setPlans((prevPlans) => ({
      ...prevPlans,
      [day]: prevPlans[day].map((plan) =>
        plan.id === id ? { ...plan, editing: true } : plan
      ),
    }));
    return Promise.resolve();
  };

  const savePlan = async (day: string, id: string, task: string) => {
    console.log(`Saving plan: day=${day}, id=${id}, task=${task}`);
    const docRef = doc(db, "plans", id);
    await updateDoc(docRef, { task });
    console.log(`Updated Firestore document for id=${id} with task=${task}`);
    setPlans((prevPlans) => {
      const updatedPlans = {
        ...prevPlans,
        [day]: prevPlans[day].map((plan) =>
          plan.id === id ? { ...plan, task, editing: false } : plan
        ),
      };
      console.log("Updated plans after saving:", updatedPlans);
      return updatedPlans;
    });
    
  };
  

  return {
    user,
    plans,
    favoritePlans,
    addPlan,
    toggleStarPlan,
    editPlan,
    completePlan,
    deletePlan,
    savePlan,
    loading,
  };
};


const getDateForDay = (day: string, startOfWeek: Date): Date => {
  const dayIndex = daysOfWeek.indexOf(day);
  const date = addDays(startOfWeek, dayIndex);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};