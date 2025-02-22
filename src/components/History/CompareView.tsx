import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../Firebase-config';
import { format } from 'date-fns';
import styles from "../History/HistoryViews.module.scss";

export const CompareView: React.FC = () => {
    const [firstMonth, setFirstMonth] = useState<Date>(new Date());
    const [secondMonth, setSecondMonth] = useState<Date>(new Date());
    const [comparison, setComparison] = useState<{
      firstMonth: { total: number; completed: number; rate: number };
      secondMonth: { total: number; completed: number; rate: number };
    }>({
      firstMonth: { total: 0, completed: 0, rate: 0 },
      secondMonth: { total: 0, completed: 0, rate: 0 }
    });
  
    useEffect(() => {
      const fetchMonthComparison = async () => {
        if (!auth.currentUser) return;
  
        const fetchMonthStats = async (date: Date) => {
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
          const plansRef = collection(db, 'plans');
          const q = query(
            plansRef,
            where('uid', '==', auth.currentUser?.uid),
            where('date', '>=', startOfMonth),
            where('date', '<=', endOfMonth)
          );
  
          const querySnapshot = await getDocs(q);
          let total = 0;
          let completed = 0;
  
          querySnapshot.forEach((doc) => {
            total++;
            if (doc.data().completed) completed++;
          });
  
          return {
            total,
            completed,
            rate: total ? Math.round((completed / total) * 100) : 0
          };
        };
  
        const firstMonthStats = await fetchMonthStats(firstMonth);
        const secondMonthStats = await fetchMonthStats(secondMonth);
  
        setComparison({
          firstMonth: firstMonthStats,
          secondMonth: secondMonthStats
        });
      };
  
      fetchMonthComparison();
    }, [firstMonth, secondMonth]);
  
    return (
      <div className={styles.compare__container}>
        <div className={styles.compare__month_selectors}>
          <div>
            <h3>First Month</h3>
            <input
              type="month"
              value={format(firstMonth, 'yyyy-MM')}
              onChange={(e) => setFirstMonth(new Date(e.target.value))}
              className={styles.compare__month_input}
            />
          </div>
          <div>
            <h3>Second Month</h3>
            <input
              type="month"
              value={format(secondMonth, 'yyyy-MM')}
              onChange={(e) => setSecondMonth(new Date(e.target.value))}
              className={styles.compare__month_input}
            />
          </div>
        </div>
  
        <div className={styles.compare__stats_grid}>
          <div className={styles.compare__month_stats}>
            <h3>{format(firstMonth, 'MMMM yyyy')}</h3>
            <div className={styles.compare__stat_item}>
              <h4>Total Goals</h4>
              <p>{comparison.firstMonth.total}</p>
            </div>
            <div className={styles.compare__stat_item}>
              <h4>Completed Goals</h4>
              <p>{comparison.firstMonth.completed}</p>
            </div>
            <div className={styles.compare__stat_item}>
              <h4>Completion Rate</h4>
              <p>{comparison.firstMonth.rate}%</p>
            </div>
          </div>
  
          <div className={styles.compare__month_stats}>
            <h3>{format(secondMonth, 'MMMM yyyy')}</h3>
            <div className={styles.compare__stat_item}>
              <h4>Total Goals</h4>
              <p>{comparison.secondMonth.total}</p>
            </div>
            <div className={styles.compare__stat_item}>
              <h4>Completed Goals</h4>
              <p>{comparison.secondMonth.completed}</p>
            </div>
            <div className={styles.compare__stat_item}>
              <h4>Completion Rate</h4>
              <p>{comparison.secondMonth.rate}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default CompareView