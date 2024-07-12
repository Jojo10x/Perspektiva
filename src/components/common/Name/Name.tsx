import {  onAuthStateChanged} from 'firebase/auth'
import { auth} from '../../../../Firebase-config'
import styles from "../../../styles/components/Name/Name.module.scss";
import { useEffect, useState } from 'react';
import DisplayName from '../../DisplayName/DisplayName';
const Name = () => {
  const [user, setUser] = useState<any>(null);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    
    const timer = setTimeout(() => {
      setShowName(true);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
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
    {!showName ? (
      <h1 className={styles.perspektiva}>Perspektiva</h1>
    ) : (
      <h2 className={styles.mainTitle}>
        Hello
        <span className={styles["waving-hand"]} role="img" aria-label="waving hand">
          👋
        </span>
        <span className={styles.displayName}><DisplayName /></span>
      </h2>
    )}
  </div>
  );
};

export default Name;
