import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../Firebase-config';
import { format, differenceInDays } from 'date-fns';
import styles from "../History/HistoryViews.module.scss";
export const TimeView: React.FC = () => {
  const [timeStats, setTimeStats] = useState({
    averageCompletion: 0,
    fastestCompletion: Infinity,
    slowestCompletion: 0,
    last7Days: 0,
    last30Days: 0,
    last90Days: 0,
    distribution: {
      '0-7': 0,
      '8-14': 0,
      '15-30': 0,
      '31-60': 0,
      '60+': 0
    }
  });

  useEffect(() => {
    const fetchTimeStats = async () => {
      if (!auth.currentUser) return;

      const plansRef = collection(db, 'plans');
      const q = query(plansRef, where('uid', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      let completionTimes: number[] = [];
      let last7 = 0, last30 = 0, last90 = 0;
      let distribution = { '0-7': 0, '8-14': 0, '15-30': 0, '31-60': 0, '60+': 0 };
      
      const now = new Date();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.completed && data.date) {
          const completionTime = differenceInDays(data.completedAt?.toDate() || now, data.date.toDate());
          completionTimes.push(completionTime);

          // Update distribution
          if (completionTime <= 7) distribution['0-7']++;
          else if (completionTime <= 14) distribution['8-14']++;
          else if (completionTime <= 30) distribution['15-30']++;
          else if (completionTime <= 60) distribution['31-60']++;
          else distribution['60+']++;

          // Update recent trends
          const daysAgo = differenceInDays(now, data.completedAt?.toDate());
          if (daysAgo <= 7) last7++;
          if (daysAgo <= 30) last30++;
          if (daysAgo <= 90) last90++;
        }
      });

      setTimeStats({
        averageCompletion: completionTimes.length ? 
          Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length) : 0,
        fastestCompletion: Math.min(...completionTimes, Infinity),
        slowestCompletion: Math.max(...completionTimes, 0),
        last7Days: last7,
        last30Days: last30,
        last90Days: last90,
        distribution
      });
    };

    fetchTimeStats();
  }, []);

  return (
    <div className={styles.time__container}>
      <div className={styles.time__stats_grid}>
        <div className={styles.time__stat_card}>
          <h3>Average Completion Time</h3>
          <p>{timeStats.averageCompletion} days</p>
        </div>
        <div className={styles.time__stat_card}>
          <h3>Fastest Completion</h3>
          <p>{timeStats.fastestCompletion === Infinity ? 'N/A' : `${timeStats.fastestCompletion} days`}</p>
        </div>
        <div className={styles.time__stat_card}>
          <h3>Slowest Completion</h3>
          <p>{timeStats.slowestCompletion} days</p>
        </div>
      </div>

      <div className={styles.time__recent_trends}>
        <h3>Recent Trends</h3>
        <div className={styles.time__trends_grid}>
          <div>
            <h4>Last 7 days</h4>
            <p>{timeStats.last7Days} completions</p>
          </div>
          <div>
            <h4>Last 30 days</h4>
            <p>{timeStats.last30Days} completions</p>
          </div>
          <div>
            <h4>Last 90 days</h4>
            <p>{timeStats.last90Days} completions</p>
          </div>
        </div>
      </div>

      <div className={styles.time__distribution}>
        <h3>Completion Time Distribution</h3>
        <div className={styles.time__distribution_grid}>
          {Object.entries(timeStats.distribution).map(([range, count]) => (
            <div key={range} className={styles.time__distribution_item}>
              <h4>{range} days</h4>
              <p>{count} tasks</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeView;