import styles from "../../../styles/Plans.module.scss";
import {daysOfWeek} from "../../../types/constants"

type Plan = {
    id: string;
    task: string;
    completed: boolean;
    editing: boolean;
    newTask: string;
    starred: boolean;
  };

interface FavoritePlansProps {
    favoritePlans: Plan[];
    onAddFavoritePlanToDay: (favoritePlan: Plan, day: string) => void;
  }
  
  const FavoritePlans: React.FC<FavoritePlansProps> = ({ favoritePlans, onAddFavoritePlanToDay }) => {
    return (
      <div className={styles.favoritePlans}>
        <h2 className={styles.favoritePlans__title}>Favorite Plans</h2>
        <ul className={styles.favoritePlans__list}>
          {favoritePlans.map((favPlan) => (
            <li key={favPlan.id} className={styles.favoritePlans__item}>
              <span className={styles.favoritePlans__task}>{favPlan.task}</span>
              <div className={styles.favoritePlans__buttons}>
                {daysOfWeek.map((day) => (
                  <button
                    key={`${favPlan.id}-${day}`}
                    onClick={() => onAddFavoritePlanToDay(favPlan, day)}
                    className={styles.favoritePlans__button}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FavoritePlans;