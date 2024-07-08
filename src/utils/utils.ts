import { addDays, startOfWeek, endOfWeek, format } from 'date-fns';
import { daysOfWeek } from "../types/constants";
import {Plan} from "../types/types"

export const getDateForDay = (day: string, startOfWeek: Date): Date => {
  const dayIndex = daysOfWeek.indexOf(day);
  return addDays(startOfWeek, dayIndex);
};

export const calculateTotalPlans = (plans: { [key: string]: Plan[] }): number => {
    return Object.values(plans).reduce(
      (total, dayPlans) => total + dayPlans.length,
      0
    );
  };
  
  export const calculateCompletedPlans = (plans: { [key: string]: Plan[] }): number => {
    return Object.values(plans).reduce(
      (total, dayPlans) =>
        total + dayPlans.filter((plan) => plan.completed).length,
      0
    );
  };

export const getInitialWeek = () => ({
  start: startOfWeek(new Date(), { weekStartsOn: 1 }),
  end: endOfWeek(new Date(), { weekStartsOn: 1 }),
});