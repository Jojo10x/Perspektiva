import { useEffect, useState } from "react";
import styles from "../../../styles/components/Plans/Plans.module.scss";

interface NewPlanInputProps {
    onAddPlan: (task: string) => void;
  }
  
  const NewPlanInput: React.FC<NewPlanInputProps> = ({ onAddPlan }) => {
    const [showHint, setShowHint] = useState(false);
    const [inputValue, setInputValue] = useState('');
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onAddPlan(e.currentTarget.value);
        setInputValue('');
        setShowHint(false);
      }
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (e.target.value.length > 0 && !showHint) {
        setShowHint(true);
      } else if (e.target.value.length === 0) {
        setShowHint(false);
      }
    };
  
    useEffect(() => {
      let timeout: NodeJS.Timeout;
      if (showHint) {
        timeout = setTimeout(() => setShowHint(false), 3000);
      }
      return () => clearTimeout(timeout);
    }, [showHint]);
  
    return (
      <>
      <input
        type="text"
        placeholder="New Task"
        className={styles.plans__task_input}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        value={inputValue}
      />
      <span className={`${styles.plans__save_hint} ${showHint ? styles['plans__save_hint--visible'] : ''}`}>
        Press Enter to save
      </span>
    </>
    );
  };
  
  export default NewPlanInput;