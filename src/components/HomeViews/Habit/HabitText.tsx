import Link from "next/link";
import styles from "../../../styles/HabitText.module.scss";
const HabitText = () => {
  return (
<div className={styles.container}>
      <h1 className={styles.title}>Build Better Habits</h1>
      <h3 className={styles.subtitle}>Transform Your Life, One Habit at a Time</h3>
      <div className={styles.features}>
        <div className={styles.feature}>
          <i className={`${styles.icon} ${styles.iconProductivity}`}></i>
          <h4>Increase Productivity</h4>
          <p>Optimize your daily routines</p>
        </div>
        <div className={styles.feature}>
          <i className={`${styles.icon} ${styles.iconMentalHealth}`}></i>
          <h4>Boost Mental Health</h4>
          <p>Develop habits for well-being</p>
        </div>
        <div className={styles.feature}>
          <i className={`${styles.icon} ${styles.iconGoals}`}></i>
          <h4>Achieve Goals Faster</h4>
          <p>Turn aspirations into reality</p>
        </div>
      </div>
      <p className={styles.description}>
        Creating positive habits is the key to personal growth and success. Our habit tracking tool 
        helps you establish, monitor, and maintain beneficial routines that will improve your life. 
        Start small, stay consistent, and watch as your life transforms through the power of good habits.
      </p>
      <Link href="/Habit" className={styles.button}>
        Start Your Habit Journey
      </Link>
    </div>
  );
};


export default HabitText;