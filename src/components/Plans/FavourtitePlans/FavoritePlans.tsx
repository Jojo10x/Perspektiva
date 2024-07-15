import { useState } from "react";
import styles from "../../../styles/components/Plans/Plans.module.scss";
import { daysOfWeek } from "../../../types/constants";
import { FaHeart, FaPlus, FaTimes } from "react-icons/fa";
import Button from "@/components/common/Button/Button";

type Plan = {
  id: string;
  task: string;
  completed: boolean;
  editing: boolean;
  newTask: string;
  starred: boolean;
};

interface FavoritePlan {
  id: string;
  task: string;
}
interface FavoritePlansProps {
  favoritePlans: Plan[];
  onAddFavoritePlanToDay: (plan: FavoritePlan, day: string) => void;
}

const FavoritePlans: React.FC<FavoritePlansProps> = ({
  favoritePlans,
  onAddFavoritePlanToDay,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FavoritePlan | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <>
      <Button
        content=" Favorites"
        className={styles.favoritePlansButton}
        onClick={openModal}
      >
        Favorites
      </Button>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal}>
              <FaTimes />
            </button>
            <h2 className={styles.title}>
              <FaHeart className={styles.titleIcon} />
              Favorite Plans
            </h2>
            <div className={styles.planGrid}>
              {favoritePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`${styles.planItem} ${
                    selectedPlan?.id === plan.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <span className={styles.planTask}>{plan.task}</span>
                  <FaPlus className={styles.addIcon} />
                </div>
              ))}
            </div>
            {selectedPlan && (
              <div className={styles.selectedPlanDetails}>
                <h3>Add "{selectedPlan.task}" to:</h3>
                <div className={styles.dayButtons}>
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      className={styles.dayButton}
                      onClick={() => {
                        onAddFavoritePlanToDay(selectedPlan, day);
                        closeModal();
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FavoritePlans;
