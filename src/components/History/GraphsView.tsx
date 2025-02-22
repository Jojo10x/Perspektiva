import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../../../Firebase-config";
import { startOfMonth, endOfMonth, format, eachDayOfInterval } from 'date-fns';
import styles from "../History/HistoryViews.module.scss";
import { Plan } from '@/types/types';

interface TaskMetrics {
  month: any;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  tasksByDay: { [key: string]: number };
}

const GraphsView = () => {
  const monthlyProgressRef = useRef<HTMLCanvasElement>(null);
  const taskDistributionRef = useRef<HTMLCanvasElement>(null);
  const [monthlyData, setMonthlyData] = useState<TaskMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!auth.currentUser) return;

      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
      });

      const monthlyMetrics = await Promise.all(
        months.map(async (month) => {
          const start = startOfMonth(month);
          const end = endOfMonth(month);

          const tasksQuery = query(
            collection(db, "plans"),
            where("uid", "==", auth.currentUser?.uid),
            where("date", ">=", start),
            where("date", "<=", end)
          );

          const querySnapshot = await getDocs(tasksQuery);
          const tasks = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            date: doc.data().date.toDate()
          })) as (Plan & { date: Date })[];

          const tasksByDay: { [key: string]: number } = {};
          eachDayOfInterval({ start, end }).forEach(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            tasksByDay[dayStr] = tasks.filter(task => 
              format(task.date, 'yyyy-MM-dd') === dayStr
            ).length;
          });

          return {
            month: format(month, 'MMM'),
            totalTasks: tasks.length,
            completedTasks: tasks.filter(task => task.completed).length,
            completionRate: tasks.length > 0 
              ? (tasks.filter(task => task.completed).length / tasks.length) * 100 
              : 0,
            tasksByDay
          };
        })
      );

      setMonthlyData(monthlyMetrics);
      setLoading(false);
    };

    fetchMonthlyData();
  }, []);

  useEffect(() => {
    if (loading || !monthlyData.length) return;

    // Monthly Progress Chart
    if (monthlyProgressRef.current) {
      const ctx = monthlyProgressRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: monthlyData.map(data => data.month).reverse(),
            datasets: [
              {
                label: 'Completion Rate',
                data: monthlyData.map(data => data.completionRate).reverse(),
                borderColor: '#3b82f6',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              },
              {
                label: 'Total Tasks',
                data: monthlyData.map(data => data.totalTasks).reverse(),
                borderColor: '#8b5cf6',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false,
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Monthly Progress & Task Volume',
                font: {
                  size: 16,
                  family: "'Montserrat', sans-serif",
                  weight: 'bold'
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Completion Rate (%)'
                }
              },
              y1: {
                beginAtZero: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'Number of Tasks'
                },
                grid: {
                  drawOnChartArea: false
                }
              }
            }
          }
        });
      }
    }

    // Task Distribution Chart (Daily Average)
    if (taskDistributionRef.current) {
      const ctx = taskDistributionRef.current.getContext('2d');
      if (ctx) {
        const currentMonthData = monthlyData[0];
        const dailyAverages = Object.values(currentMonthData.tasksByDay);
        
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(currentMonthData.tasksByDay).map(date => 
              format(new Date(date), 'dd MMM')
            ),
            datasets: [{
              label: 'Tasks per Day',
              data: dailyAverages,
              backgroundColor: '#3b82f6',
              borderRadius: 5
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Daily Task Distribution (Current Month)',
                font: {
                  size: 16,
                  family: "'Montserrat', sans-serif",
                  weight: 'bold'
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }
    }
  }, [monthlyData, loading]);

  if (loading) {
    return <div>Loading charts...</div>;
  }

  return (
    <div className={styles.graphs__container}>
      <div className={styles.graphs__row}>
        <div className={styles.graphs__chart}>
          <canvas ref={monthlyProgressRef}></canvas>
        </div>
        <div className={styles.graphs__chart}>
          <canvas ref={taskDistributionRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default GraphsView;