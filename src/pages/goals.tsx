
import { useState, useEffect } from 'react';
import styles from '../styles/components/Goals/Goals.module.scss';
import {auth, db} from '../../Firebase-config';
import Breadcrumb from '../components/common/Breadcrumbs/Breadcrumb';
import Loader from '../components/common/Loader/Loader';
import { User, onAuthStateChanged } from 'firebase/auth';
import Button from '@/components/common/Button/Button';
import { useAuth } from '../hooks/Goals/useAuth';
import { useGoals } from '../hooks/Goals/useGoals';
import GoalItem from '../components/Goals/GoalItem';
import GoalModal from '../components/Goals/GoalModal';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/contexts/Auth/AuthContext';

const Goals: React.FC = () => {
  const currentUser = useAuth();
  const { goals, loading, addGoal, updateGoal, deleteGoal } = useGoals(currentUser ? currentUser.uid : null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newGoal, setNewGoal] = useState({ title: '', timeframe: 1 });
  const { user} = useAuthContext();
  const router = useRouter();

  if (!user) {
    router.push('/goals');
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  const filteredGoals = goals.filter(goal => {
    const matchesFilter = 
      (filter === 'all') || 
      (filter === 'active' && !goal.completed) || 
      (filter === 'completed' && goal.completed);
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const handleAddGoal = () => {
    if (currentUser) {
      addGoal({ ...newGoal, userId: currentUser.uid });
      setIsModalOpen(false);
      setNewGoal({ title: '', timeframe: 1 });
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumb />
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
        <Button
          onClick={() => setIsModalOpen(true)}
          className={styles.addButton}
          content="GOALS"
        >
          New Goal
        </Button>
      </header>

      <nav className={styles.filterNav}>
        {["all", "active", "completed"].map((filterType) => (
          <button
            key={filterType}
            className={`${styles.filterButton} ${
              filter === filterType ? styles.active : ""
            }`}
            onClick={() => setFilter(filterType)}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </nav>

      <div className={styles.goalsList}>
        {filteredGoals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            updateGoal={updateGoal}
            deleteGoal={deleteGoal}
          />
        ))}
      </div>

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newGoal={newGoal}
        setNewGoal={setNewGoal}
        addGoal={handleAddGoal}
      />
    </div>
  );
};

export default Goals;

