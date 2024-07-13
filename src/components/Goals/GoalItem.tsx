import React from 'react';
import { Goal } from '../../types/typesGoals';
import { formatDate, calculateTimeLeft, calculateDeadline } from '../../utils/utilsGoals';
import styles from '../../styles/components/Goals/Goals.module.scss';
import { Timestamp } from 'firebase/firestore';

interface GoalItemProps {
  goal: Goal;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, updateGoal, deleteGoal }) => {
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
};

export default GoalItem;
