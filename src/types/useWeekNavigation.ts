import { useState } from 'react';
import { addDays } from 'date-fns';
import { getInitialWeek } from '../utils/utils';

export const useWeekNavigation = () => {
  const [currentWeek, setCurrentWeek] = useState(getInitialWeek());

  const goToNextWeek = () => {
    setCurrentWeek((prevWeek) => ({
      start: addDays(prevWeek.start, 7),
      end: addDays(prevWeek.end, 7),
    }));
  };

  const goToPreviousWeek = () => {
    setCurrentWeek((prevWeek) => ({
      start: addDays(prevWeek.start, -7),
      end: addDays(prevWeek.end, -7),
    }));
  };

  return { currentWeek, goToNextWeek, goToPreviousWeek };
};