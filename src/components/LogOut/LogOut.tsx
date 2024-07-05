import { signOut} from 'firebase/auth'
import { auth} from '../../../Firebase-config'
import styles from "../../styles/LogOut.module.scss";
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
        <div className={styles.userInfo}>
          <h3 className={styles.email}>Email: {user.email}</h3>
          <button 
            className={styles.logoutButton} 
            onClick={onClick || handleLogout}
          >
            Logout
          </button>
        </div>
      )}
  </>
);
};
  
  export default LogOut;