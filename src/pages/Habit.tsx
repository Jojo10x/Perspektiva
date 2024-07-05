import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, { useState } from 'react';

interface Habit {
  name: string;
  dailyHours: number[];
  completedHours: number[];
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitName, setHabitName] = useState('');
  const [dailyHours, setDailyHours] = useState<number[]>(Array(7).fill(0));

  const handleAddHabit = () => {
    if (habitName && dailyHours.some(hours => hours > 0)) {
      setHabits([...habits, { name: habitName, dailyHours, completedHours: Array(7).fill(0) }]);
      setHabitName('');
      setDailyHours(Array(7).fill(0));
    }
  };

  const calculateTotalHoursPerWeek = (dailyHours: number[], completedHours: number[]) => {
    return dailyHours.reduce((acc, hours, index) => acc + (hours - completedHours[index]), 0);
  };

  const calculateTotalHoursPerMonth = (dailyHours: number[], completedHours: number[]) => {
    return calculateTotalHoursPerWeek(dailyHours, completedHours) * 4;
  };

  const handleCompleteHoursChange = (habitIndex: number, dayIndex: number, value: number) => {
    const updatedHabits = [...habits];
    updatedHabits[habitIndex].completedHours[dayIndex] = value;
    setHabits(updatedHabits);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <Breadcrumb />
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Habit Tracker</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        {daysOfWeek.map((day, index) => (
          <div className="mb-4" key={day}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{day}</label>
            <input
              type="number"
              value={dailyHours[index]}
              onChange={(e) => {
                const newDailyHours = [...dailyHours];
                newDailyHours[index] = e.target.value ? Number(e.target.value) : 0;
                setDailyHours(newDailyHours);
              }}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
        ))}
        <button
          onClick={handleAddHabit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Habit
        </button>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Habits</h2>
          <ul>
            {habits.map((habit, habitIndex) => (
              <li key={habitIndex} className="mb-4">
                <div className="flex flex-col">
                  <span className="font-semibold">{habit.name}</span>
                  <div className="mt-2">
                    {daysOfWeek.map((day, dayIndex) => (
                      <div key={dayIndex} className="flex justify-between items-center">
                        <span>{day}:</span>
                        <div className="flex items-center">
                          <span>{habit.dailyHours[dayIndex]} hours</span>
                          <input
                            type="number"
                            value={habit.completedHours[dayIndex]}
                            onChange={(e) =>
                              handleCompleteHoursChange(habitIndex, dayIndex, e.target.value ? Number(e.target.value) : 0)
                            }
                            className="ml-4 p-1 w-20 border rounded"
                          />
                          <span className="ml-2">completed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>Total weekly hours:</span>
                    <span>{calculateTotalHoursPerWeek(habit.dailyHours, habit.completedHours)} hours</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Total monthly hours:</span>
                    <span>{calculateTotalHoursPerMonth(habit.dailyHours, habit.completedHours)} hours</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
