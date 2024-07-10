import { useState } from "react";
import styles from "../../../styles/Plans.module.scss";

type Plan = {
    id: string;
    task: string;
    completed: boolean;
    editing: boolean;
    newTask: string;
    starred: boolean;
  };

interface PlanItemProps {
    plan: Plan;
    day: string;
    onEdit: (day: string, id: string) => void;
    onSave: (day: string, id: string, task: string) => void;
    onComplete: (day: string, id: string, completed: boolean) => void;
    onDelete: (day: string, id: string) => void;
    onToggleStar: (day: string, id: string) => void;
  }
  
  const PlanItem: React.FC<PlanItemProps> = ({ plan, day, onEdit, onSave, onComplete, onDelete, onToggleStar }) => {
    const [newTask, setNewTask] = useState(plan.task);
  
    return (
      <li className={styles.plans__task}>
        {plan.editing ? (
          <>
            <input
              type="text"
              className={styles.plans__task_edit_input}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onBlur={() => onSave(day, plan.id, newTask)}
            />
            <button onClick={() => onSave(day, plan.id, newTask)} className={styles.plans__task_button}>
            💾
            </button>
          </>
        ) : (
          <>
            <span className={plan.completed ? `${styles.plans__task} ${styles.plans__task_complete}` : styles.plans__task}>
              {plan.task}
            </span>
            <button onClick={() => onEdit(day, plan.id)} className={styles.plans__task_edit}>
            ✏️
            </button>
            <button onClick={() => onComplete(day, plan.id, plan.completed)} className={styles.plans__task_button}>
            {plan.completed ? "↩️" : "✅"}
            </button>
            <button onClick={() => onDelete(day, plan.id)} className={styles.plans__task_delete}>
            🗑️
            </button>
            <button onClick={() => onToggleStar(day, plan.id)} className={plan.starred ? styles.plans__task_starred : styles.plans__task_star}>
              {plan.starred ? "★" : "☆"}
            </button>
          </>
        )}
      </li>
    );
  };
  
  export default PlanItem;