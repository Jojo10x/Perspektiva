import { format, addDays } from 'date-fns';
import styles from "../../../styles/Plans.module.scss";

interface WeekNavigationProps {
  currentWeek: { start: Date; end: Date };
  onNextWeek: () => void;
  onPreviousWeek: () => void;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({ currentWeek, onNextWeek, onPreviousWeek }) => {
  return (
    <div className={styles.plans__navigation}>
      <button onClick={onPreviousWeek}>Previous Week</button>
      <span>
        {format(currentWeek.start, "MMM dd")} - {format(currentWeek.end, "MMM dd")}
      </span>
      <button onClick={onNextWeek}>Next Week</button>
    </div>
  );
};

export default WeekNavigation;