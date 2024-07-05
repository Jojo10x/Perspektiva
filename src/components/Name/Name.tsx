import {  onAuthStateChanged} from 'firebase/auth'
import { auth} from '../../../Firebase-config'
import styles from "../../styles/Name.module.scss";
import { useEffect, useState } from 'react';
const Name = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user: any) {
    if (user) {
      setUser({ ...user });
    } else {
      setUser(null);
    }
  }
  return (
    <div  className={styles["login-containe"]}>
    <h2 className={styles["main-title"]}>
      Hello
      <span
        className={styles["waving-hand"]}
        role="img"
        aria-label="waving hand"
      >
        👋
      </span>
    </h2>
    {user && (
      <div className={styles.loggedInMessage}>
        <h2 className={`${styles.title} ${styles.animatedEmoji}`}>
          {/* Welcome {user} 🎉 */}
        </h2>
      </div>
    )}
    </div>
  );
};

export default Name;
