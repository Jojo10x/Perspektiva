import { signOut} from 'firebase/auth'
import { auth} from '../../../Firebase-config'
import styles from "../../styles/components/Auth/LogOut.module.scss";
import { useRouter } from 'next/navigation'

interface LogOutProps {
  onClick?: () => void;
}

const LogOut: React.FC<LogOutProps> = ({ onClick }) => {
  const user = auth.currentUser;
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/Login');
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  return (
    <>
    {user && (
    <div className={styles.userInfoContainer}>
      <div className={styles.userEmail}>
        <span className={styles.emailLabel}>Email:</span>
        <span className={styles.emailValue}>{user.email}</span>
      </div>
      <button 
        className={styles.logoutButton}
        onClick={onClick || handleLogout}
      >
        <span className={styles.logoutIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M16 13v-2H7V8l-5 4 5 4v-3z"/>
            <path d="M20 3h-9c-1.11 0-2 .89-2 2v4h2V5h9v14h-9v-4H9v4c0 1.11.89 2 2 2h9c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2z"/>
          </svg>
        </span>
        Logout
      </button>
    </div>
  )}
  </>
);
};
  
  export default LogOut;