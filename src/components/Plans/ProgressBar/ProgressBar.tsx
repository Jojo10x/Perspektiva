import styles from "../../../styles/Plans.module.scss";

interface ProgressBarProps {
    totalPlans: number;
    completedPlans: number;
  }
  
  const ProgressBar: React.FC<ProgressBarProps> = ({ totalPlans, completedPlans }) => {
    const progressPercentage = totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0;
  
    return (
      <div className={styles.plans__progress_bar}>
        <div
          className={styles.plans__progress}
          style={{ width: `${progressPercentage}%` }}
        >
          <span className={styles.plans__progress__label}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;