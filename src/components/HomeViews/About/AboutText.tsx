import styles from "../../../styles/components/Texts/AboutText.module.scss";
const AboutText = () => {
  const currYear = new Date().getFullYear();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Perspektiva</h1>
      <div className={styles.content}>
        <div className={styles.section}>
          <i className={`${styles.icon} ${styles.iconHabit}`}></i>
          <h3>Habit Builder</h3>
          <p>
            Develop positive routines and track your progress to transform your
            life.
          </p>
        </div>
        <div className={styles.section}>
          <i className={`${styles.icon} ${styles.iconPlan}`}></i>
          <h3>Life Planner</h3>
          <p>
            Organize your goals and create actionable plans to achieve your
            dreams.
          </p>
        </div>
        <div className={styles.section}>
          <i className={`${styles.icon} ${styles.iconClarity}`}></i>
          <h3>Create Goals</h3>
          <p>Align goals across life areas.</p>
        </div>
      </div>
      <div className={styles.mission}>
        <h3>Our Mission</h3>
        <p>
        Perspektiva is dedicated to improving people&apos;s lives through effective
          habit building and strategic planning. We believe that small,
          consistent actions lead to significant life changes.
        </p>
      </div>
      <footer className={styles.footer}>
        <p>&copy; {currYear} Perspektiva. All Rights Reserved.</p>
        <p>
          Created by{" "}
          <a
            href="https://joelkasisi.netlify.app/"
            className={styles.footerLink}
          >
            Joel Kasisi
          </a>
        </p>
      </footer>
    </div>
  );
};

export default AboutText;
