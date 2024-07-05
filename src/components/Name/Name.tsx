import {  onAuthStateChanged} from 'firebase/auth'
import { auth} from '../../../Firebase-config'
import styles from "../../styles/Name.module.scss";
import { useEffect, useState } from 'react';
import DisplayName from '../DisplayName/DisplayName';
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
    <div className={styles.loginContainer}>
    <h2 className={styles.mainTitle}>
      Hello
      <span
        className={styles["waving-hand"]}
        role="img"
        aria-label="waving hand"
      >
        👋 
      </span>
        <span className={styles.displayName}><DisplayName /></span>
    </h2>
    </div>
  );
};

export default Name;
