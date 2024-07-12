import Link from "next/link";
import styles from "../../../styles/components/Texts/GoalText.module.scss";
import Button from "@/components/common/Button/Button";
const GoalsText = () => {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Set and Achieve Your Goals</h1>
        <h3 className={styles.subtitle}>
          Turn Your Dreams into Reality, Step by Step
        </h3>
        <div className={styles.features}>
          <div className={styles.feature}>
            <i className={`${styles.icon} ${styles.iconClarity}`}></i>
            <h4>Gain Clarity</h4>
            <p>Define clear, actionable objectives</p>
          </div>
          <div className={styles.feature}>
            <i className={`${styles.icon} ${styles.iconMotivation}`}></i>
            <h4>Stay Motivated</h4>
            <p>Track progress and celebrate wins</p>
          </div>
          <div className={styles.feature}>
            <i className={`${styles.icon} ${styles.iconBalance}`}></i>
            <h4>Achieve Balance</h4>
            <p>Align goals across life areas</p>
          </div>
        </div>
        <p className={styles.description}>
          Setting and pursuing meaningful goals is essential for personal and
          professional growth. Our goal-setting tool empowers you to define,
          plan, and accomplish your objectives effectively. Whether big or
          small, each goal you achieve brings you closer to your ideal life.
          Start today and experience the satisfaction of turning your
          aspirations into achievements.
        </p>
        <Link href="/goals">
          <Button content="GOALS">Begin Your Goal Journey</Button>
        </Link>
      </div>
    );
  };
  
  export default GoalsText;