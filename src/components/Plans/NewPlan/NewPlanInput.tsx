import styles from "../../../styles/Plans.module.scss";

interface NewPlanInputProps {
    onAddPlan: (task: string) => void;
  }
  
  const NewPlanInput: React.FC<NewPlanInputProps> = ({ onAddPlan }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onAddPlan(e.currentTarget.value);
        e.currentTarget.value = "";
      }
    };
  
    return (
      <input
        type="text"
        placeholder="New Task"
        className={styles.plans__task_input}
        onKeyDown={handleKeyDown}
      />
    );
  };
  
  export default NewPlanInput;