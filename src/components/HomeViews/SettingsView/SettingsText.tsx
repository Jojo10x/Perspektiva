import Link from "next/link";
import styles from "../../../styles/components/Texts/SettingsText.module.scss";
import Button from "@/components/common/Button/Button";
const SettingsText = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Personalize Your Experience</h1>
      <h3 className={styles.subtitle}>Tailor the App to Your Preferences</h3>
      <div className={styles.features}>
        <div className={styles.feature}>
          <i className={`${styles.icon} ${styles.iconProfile}`}></i>
          <h4>Profile Settings</h4>
          <p>Customize your personal information</p>
        </div>
        <div className={styles.feature}>
          <i className={`${styles.icon} ${styles.iconNotifications}`}></i>
          <h4>Notification Preferences</h4>
          <p>Control how and when you are notified</p>
        </div>
        <div className={styles.feature}>
          <i className={`${styles.icon} ${styles.iconTheme}`}></i>
          <h4>Theme Options</h4>
          <p>Choose your preferred color scheme</p>
        </div>
      </div>
      <p className={styles.description}>
        Take full control of your app experience with our comprehensive
        settings. From adjusting your profile details to fine-tuning
        notifications and personalizing the app&apos;s appearance, make the app truly
        yours.
      </p>
      <Link href="/Settings">
        <Button content="SETTINGS"> Customize Your Settings</Button>
      </Link>
    </div>
  );
};

export default SettingsText;
