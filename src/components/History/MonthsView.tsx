import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../../../Firebase-config";
import { startOfMonth, endOfMonth, format, eachMonthOfInterval, subMonths } from 'date-fns';
import styles from "../History/HistoryViews.module.scss";
import { Plan } from '@/types/types';

interface MonthMetrics {
  month: string;
  totalGoals: number;
  completed: number;
  successRate: number;
}

const MonthsView = () => {
  const [monthsData, setMonthsData] = useState<MonthMetrics[]>([]);
  const [yearOverview, setYearOverview] = useState<{
    totalGoals: number;
    completedGoals: number;
    averageCompletionRate: number;
    mostProductiveMonth: string;
    leastProductiveMonth: string;
  }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!auth.currentUser) return;

      // Get the last 12 months
      const end = new Date();
      const start = subMonths(end, 11);
      const monthsInterval = eachMonthOfInterval({ start, end });

      const monthlyMetrics = await Promise.all(
        monthsInterval.map(async (month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);

          const tasksQuery = query(
            collection(db, "plans"),
            where("uid", "==", auth.currentUser?.uid),
            where("date", ">=", monthStart),
            where("date", "<=", monthEnd)
          );

          const querySnapshot = await getDocs(tasksQuery);
          const tasks = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Plan[];

          const completed = tasks.filter(task => task.completed).length;

          return {
            month: format(month, 'MMMM'),
            totalGoals: tasks.length,
            completed,
            successRate: tasks.length > 0 ? (completed / tasks.length) * 100 : 0
          };
        })
      );

      setMonthsData(monthlyMetrics);

      // Calculate year overview
      const overview = {
        totalGoals: monthlyMetrics.reduce((acc, month) => acc + month.totalGoals, 0),
        completedGoals: monthlyMetrics.reduce((acc, month) => acc + month.completed, 0),
        averageCompletionRate: monthlyMetrics.reduce((acc, month) => acc + month.successRate, 0) / monthlyMetrics.length,
        mostProductiveMonth: monthlyMetrics.reduce((prev, current) => 
          (prev.completed > current.completed) ? prev : current
        ).month,
        leastProductiveMonth: monthlyMetrics.reduce((prev, current) => 
          (prev.completed < current.completed) ? prev : current
        ).month
      };

      setYearOverview(overview);
      setLoading(false);
    };

    fetchMonthlyData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className={styles.months__container}>
      <div className={styles.months__grid}>
        {monthsData.map((month) => (
          <div key={month.month} className={styles.months__card}>
            <h3 className={styles.months__card_title}>{month.month}</h3>
            <div className={styles.months__card_stats}>
              <div className={styles.months__stat}>
                <span className={styles.months__stat_label}>Total Goals</span>
                <span className={styles.months__stat_value}>{month.totalGoals}</span>
              </div>
              <div className={styles.months__stat}>
                <span className={styles.months__stat_label}>Completed</span>
                <span className={styles.months__stat_value}>{month.completed}</span>
              </div>
              <div className={styles.months__stat}>
                <span className={styles.months__stat_label}>Success Rate</span>
                <span className={styles.months__stat_value}>{month.successRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {yearOverview && (
        <div className={styles.months__overview}>
          <h2 className={styles.months__overview_title}>Year Overview</h2>
          <div className={styles.months__overview_grid}>
            <div className={styles.months__overview_card}>
              <h4>Total Goals</h4>
              <span className="highlight">{yearOverview.totalGoals}</span>
            </div>
            <div className={styles.months__overview_card}>
              <h4>Completed Goals</h4>
              <span className="highlight">{yearOverview.completedGoals}</span>
            </div>
            <div className={styles.months__overview_card}>
              <h4>Average Completion Rate</h4>
              <span>{yearOverview.averageCompletionRate.toFixed(1)}%</span>
            </div>
            <div className={styles.months__overview_card}>
              <h4>Most Productive Month</h4>
              <span>{yearOverview.mostProductiveMonth}</span>
            </div>
            <div className={styles.months__overview_card}>
              <h4>Least Productive Month</h4>
              <span>{yearOverview.leastProductiveMonth}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthsView;