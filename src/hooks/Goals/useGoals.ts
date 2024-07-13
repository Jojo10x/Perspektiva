import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp, query, where } from 'firebase/firestore';
import { db } from '../../../Firebase-config';
import { Goal } from '../../types/typesGoals';

export const useGoals = (userId: string | null) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchGoals(userId).then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchGoals = async (userId: string) => {
    const goalsCollection = collection(db, 'goals');
    const q = query(goalsCollection, where('userId', '==', userId));
    const goalsSnapshot = await getDocs(q);
    const goalsList = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
    setGoals(goalsList);
  };

  const addGoal = async (newGoal: Omit<Goal, 'id' | 'createdAt' | 'completed'>) => {
    if (!userId) return;
    const goalsCollection = collection(db, 'goals');
    await addDoc(goalsCollection, {
      ...newGoal,
      createdAt: Timestamp.now(),
      completed: false,
      userId: userId,
    });
    fetchGoals(userId);
  };

  const updateGoal = async (id: string, data: Partial<Goal>) => {
    if (!userId) return;
    const goalDoc = doc(db, 'goals', id);
    await updateDoc(goalDoc, data);
    fetchGoals(userId);
  };

  const deleteGoal = async (id: string) => {
    if (!userId) return;
    const goalDoc = doc(db, 'goals', id);
    await deleteDoc(goalDoc);
    fetchGoals(userId);
  };

  return { goals, loading, addGoal, updateGoal, deleteGoal };
};
