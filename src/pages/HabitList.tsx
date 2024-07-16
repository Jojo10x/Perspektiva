import React from 'react';
import styles from "../styles/components/Habits/HabitList.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { daysOfWeek } from '../types/constants';
import Link from "next/link";
import { User, onAuthStateChanged} from "firebase/auth";
import Modal from "@/components/common/Modal/Modal";
import Loader from "@/components/common/Loader/Loader";


import HabitItem from "../components/Habits/HabitList";
import { useHabitManagement } from "../hooks/userHabitList";

const HabitList: React.FC = () => {
  const {
    habits,
    loading,
    modalInfo,
    handleDailyHoursChange,
    handleCompleteHoursChange,
    confirmDeleteHabit,
    handleDeleteHabit,
    closeModal,
  } = useHabitManagement();

  if (loading) {
    return (
      <div className={styles.loader_container}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumb />
      <ul className={styles.habitList}>
        {habits.map((habit, habitIndex) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            habitIndex={habitIndex}
            onDeleteHabit={confirmDeleteHabit}
            onDailyHoursChange={handleDailyHoursChange}
            onCompleteHoursChange={handleCompleteHoursChange}
          />
        ))}
      </ul>
      {modalInfo && (
        <Modal
          message={modalInfo.message}
          type={modalInfo.type}
          onClose={closeModal}
          onConfirm={modalInfo.type === "confirm" ? handleDeleteHabit : undefined}
        />
      )}
      <Link href="/habits" className={styles.plans__history_button}>
        <span>Go Back</span>
      </Link>
    </div>
  );
};

export default HabitList;
