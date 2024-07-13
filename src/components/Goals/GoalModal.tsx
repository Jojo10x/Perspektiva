import styles from '../../styles/components/Goals/Goals.module.scss';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  newGoal: { title: string; timeframe: number };
  setNewGoal: (goal: { title: string; timeframe: number }) => void;
  addGoal: () => void;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, newGoal, setNewGoal, addGoal }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
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
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
          <button onClick={addGoal} className={styles.addButton}>Create Goal</button>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;