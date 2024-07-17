import React from 'react';
import styles from "../styles/components/Plans/Plans.module.scss";
import Link from "next/link";
import "./globals.css";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { daysOfWeek } from "../types/constants";
import FavoritePlans from "../components/Plans/FavourtitePlans/FavoritePlans";
import DayPlans from "../components/Plans/DayPlans/DayPlans";
import ProgressBar from "../components/Plans/ProgressBar/ProgressBar";
import WeekNavigation from "../components/Plans/WeekNavigation/WeekNavigation";
import { usePlans } from '../contexts/Plans/PlansContext';
import { useWeekNavigation } from '../types/useWeekNavigation';
import { getDateForDay, calculateTotalPlans, calculateCompletedPlans } from '../utils/utils';
import { useFirebasePlans } from "@/types/useFirebasePlans";
import Loader from "@/components/common/Loader/Loader";
import Button from "@/components/common/Button/Button";

const Plans = () => {
  const { currentWeek, goToNextWeek, goToPreviousWeek } = useWeekNavigation();
  const {
    plans,
    favoritePlans,
    addPlan,
    toggleStarPlan,
    completePlan,
    deletePlan,
    savePlan,
    editPlan,
    loading
  } = useFirebasePlans(currentWeek);

  const totalPlans = calculateTotalPlans(plans);
  const completedPlans = calculateCompletedPlans(plans);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.plans__container}>
      <Breadcrumb />
      <h1 className={styles.plans__header}>Weekly Plans</h1>
      <ProgressBar totalPlans={totalPlans} completedPlans={completedPlans} />
      <WeekNavigation
        currentWeek={currentWeek}
        onNextWeek={goToNextWeek}
        onPreviousWeek={goToPreviousWeek}
      />
      {daysOfWeek.map((day: string) => (
        <DayPlans
          key={day}
          day={day}
          date={getDateForDay(day, currentWeek.start)}
          plans={plans[day] || []}
          onAddPlan={addPlan}
          onEditPlan={editPlan}
          onSavePlan={savePlan}
          onCompletePlan={completePlan}
          onDeletePlan={deletePlan}
          onToggleStarPlan={toggleStarPlan}        />
      ))}
      <FavoritePlans
        favoritePlans={favoritePlans}
        onAddFavoritePlanToDay={(favoritePlan, day) => addPlan(day, favoritePlan.task)}
      />
      <div className="flex space-x-4">
        <Link href="/History" >
          <Button className={styles.plans__history_button} content={"History"}>
          History
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Plans;
