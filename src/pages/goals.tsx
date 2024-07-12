
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc,Timestamp, query, where } from 'firebase/firestore';
import styles from '../styles/Goals/Goals.module.scss';
import {auth, db} from '../../Firebase-config';
import Breadcrumb from '../components/common/Breadcrumbs/Breadcrumb';
import Loader from '../components/common/Loader/Loader';
import { User, onAuthStateChanged } from 'firebase/auth';
import Button from '@/components/common/Button/Button';
interface Goal {
  id: string;
  title: string;
  timeframe: number;
  createdAt: Timestamp;
  completed: boolean;
  userId:string;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newGoal, setNewGoal] = useState({ title: '', timeframe: 1 });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User| null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchGoals(user.uid).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function fetchGoals(userId: string) {
    const goalsCollection = collection(db, 'goals');
    const q = query(goalsCollection, where('userId', '==', userId));
    const goalsSnapshot = await getDocs(q);
    const goalsList = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
    setGoals(goalsList);
  }

  if (loading) {
    return <Loader />;
  }

  async function addGoal() {
    if (!currentUser) return;
    const goalsCollection = collection(db, 'goals');
    await addDoc(goalsCollection, {
      ...newGoal,
      createdAt:  Timestamp.now(),
      completed: false,
      userId: currentUser.uid,
    });
    setIsModalOpen(false);
    setNewGoal({ title: '', timeframe: 1 });
    fetchGoals(currentUser.uid);
  }

  async function updateGoal(id: string, data: Partial<Goal>) {
    if (!currentUser) {
      console.error("No user is currently logged in");
      return;
    }

    try {
      const goalDoc = doc(db, "goals", id);
      await updateDoc(goalDoc, data);
      await fetchGoals(currentUser.uid);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  }

  async function deleteGoal(id: string) {
    if (!currentUser) {
      console.error("No user is currently logged in");
      return;
    }
    try {
      const goalDoc = doc(db, "goals", id);
      await deleteDoc(goalDoc);
      fetchGoals(currentUser.uid);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  }
  function formatDate(timestamp: Timestamp) {
    return timestamp.toDate().toLocaleDateString();
  }
  const filteredGoals = goals.filter(goal => {
    const matchesFilter = 
      (filter === 'all') || 
      (filter === 'active' && !goal.completed) || 
      (filter === 'completed' && goal.completed);
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  function calculateDeadline(createdAt: Timestamp, timeframe: number) {
    const deadlineDate = new Date(createdAt.toDate());
    deadlineDate.setMonth(deadlineDate.getMonth() + timeframe);
    return deadlineDate;
  }

  function calculateTimeLeft(createdAt: Timestamp, timeframe: number) {
    const now = new Date();
    const deadline = calculateDeadline(createdAt, timeframe);
    const totalDuration = deadline.getTime() - createdAt.toDate().getTime();
    const timeElapsed = now.getTime() - createdAt.toDate().getTime();
    const timeLeftPercentage = Math.max(0, Math.min(100, (timeElapsed / totalDuration) * 100));
    const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    return { timeLeftPercentage, daysLeft };
  }

  return (
    <div className={styles.container}>
      <Breadcrumb/>
      <header className={styles.header}>
        <h1>Goals</h1>
        <div className={styles.searchBar}>
          <input 
            type="text" 
            placeholder="Search goals" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>
          New Goal
        </button> */}
         <Button onClick={() => setIsModalOpen(true)} className={styles.addButton} content='GOALS' >
         New Goal
        </Button>
      </header>

      <nav className={styles.filterNav}>
        {['all', 'active', 'completed'].map((filterType) => (
          <button 
            key={filterType}
            className={`${styles.filterButton} ${filter === filterType ? styles.active : ''}`}
            onClick={() => setFilter(filterType)}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </nav>

      <div className={styles.goalsList}>
        {filteredGoals.map((goal) => {
          const { timeLeftPercentage, daysLeft } = calculateTimeLeft(goal.createdAt, goal.timeframe);
          const deadline = calculateDeadline(goal.createdAt, goal.timeframe);
          return (
            <div key={goal.id} className={`${styles.goalItem} ${goal.completed ? styles.completed : ''}`}>
              <div className={styles.goalContent}>
                <h3>{goal.title}</h3>
                <div className={styles.goalInfo}>
                  <span>Created: {formatDate(goal.createdAt)}</span>
                  <span>Deadline: {formatDate(Timestamp.fromDate(deadline))}</span>
                </div>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progress_bar}>
                    <div
                      className={styles.progress}
                      style={{ width: `${timeLeftPercentage}%` }}
                    ></div>
                  </div>
                  <span className={styles.daysLeft}>{daysLeft} days left</span>
                </div>
              </div>
            <div className={styles.goalActions}>
              <button 
                onClick={() => updateGoal(goal.id, { completed: !goal.completed })}
                className={`${styles.actionButton} ${goal.completed ? styles.uncompleteButton : styles.completeButton}`}
              >
                {goal.completed ? 'Reactivate' : 'Complete'}
              </button>
              <button onClick={() => deleteGoal(goal.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>
                Delete
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className={styles.modal} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Create New Goal</h2>
            <input
              type="text"
              placeholder="What do you want to achieve?"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <div className={styles.timeframeInput}>
              <input
                type="range"
                min="1"
                max="12"
                value={newGoal.timeframe}
                onChange={(e) => setNewGoal({ ...newGoal, timeframe: parseInt(e.target.value) })}
              />
              <span>{newGoal.timeframe} month{newGoal.timeframe > 1 ? 's' : ''}</span>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>Cancel</button>
              <button onClick={addGoal} className={styles.addButton}>Create Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}