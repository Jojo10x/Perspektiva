import PlanItem from '../PlanItem/PlanItem';
import NewPlanInput from '../NewPlan/NewPlanInput';
import styles from "../../../styles/components/Plans/Plans.module.scss";
import { format } from "date-fns";
import {Plan} from '../../../types/types'

interface DayPlansProps {
  day: string;
  date: Date;
  plans: Plan[];
  onAddPlan: (day: string, task: string) => void;
  onEditPlan: (day: string, id: string) => void;
  onSavePlan: (day: string, id: string, task: string) => void;
  onCompletePlan: (day: string, id: string, completed: boolean) => void;
  onDeletePlan: (day: string, id: string) => void;
  onToggleStarPlan: (day: string, id: string) => void;
}

const DayPlans: React.FC<DayPlansProps> = ({ day, date, plans, onAddPlan, onEditPlan, onSavePlan, onCompletePlan, onDeletePlan, onToggleStarPlan }) => {
  
  return (
    <div className={styles.plans__day}>
      <div className={styles.plans__day_header}>
        <h2>{day} - {format(date, "MMM dd")}</h2>
      </div>
      <ul className={styles.plans__tasks}>
        {plans.map((plan) => (
          <PlanItem
            key={`${plan.id}-${plan.task}`}
            plan={plan}
            day={day}
            onEdit={onEditPlan}
            onSave={onSavePlan}
            onComplete={onCompletePlan}
            onDelete={onDeletePlan}
            onToggleStar={onToggleStarPlan}
          />
        ))}
      </ul>
      <NewPlanInput onAddPlan={(task) => onAddPlan(day, task)} />
    </div>
  );
};

export default DayPlans;