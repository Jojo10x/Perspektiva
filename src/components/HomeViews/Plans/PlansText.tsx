import Link from "next/link";
import styles from "../../../styles/components/Texts/PlansText.module.scss";
import Button from "@/components/common/Button/Button";
const PlansText = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Master Your Plans</h1>
      <h3 className={styles.subtitle}>Organize, Prioritize, Succeed</h3>
      <div className={styles.features}>
        <div className={styles.feature}>
          <i className={`${styles.icon} ${styles.iconCalendar}`}></i>
          <h4>Schedule Smartly</h4>
          <p>Effortlessly manage your time and tasks</p>
        </div>
        <div className={styles.feature}>
          <i className={`${styles.icon} ${styles.iconTarget}`}></i>
          <h4>Set Clear Goals</h4>
          <p>Define and track your objectives</p>
        </div>
        <div className={styles.feature}>
          <i className={`${styles.icon} ${styles.iconChart}`}></i>
          <h4>Visualize Progress</h4>
          <p>See your achievements at a glance</p>
        </div>
      </div>
      <p className={styles.description}>
        Take control of your life with our intuitive planning tool. Whether
        you are organizing your work projects, planning a vacation, or mapping
        out your five-year goals, our Plans page has got you covered.
      </p>
      <Link href="/Plans">
        <Button content="PLANS"> Start Planning Now</Button>
      </Link>
    </div>
  );
};

export default PlansText;
