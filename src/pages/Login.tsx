import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile,getAuth, signInWithPopup,  GoogleAuthProvider} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import "./globals.css";
import app from '../../Firebase-config';
import styles from '../styles/components/Auth/Login.module.scss';
import Loader from '@/components/common/Loader/Loader';
import { getReadableErrorMessage } from '../types/errorMessages';
import { FirebaseError } from 'firebase/app';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
    id: string;
    name: string | null;
    email: string | null;
  }
  
  const LoginPage: React.FC = () => {
    const [logEmail, setLogEmail] = useState("");
    const [logPassword, setLogPassword] = useState("");
    const [resEmail, setResEmail] = useState("");
    const [resPassword, setResPassword] = useState("");
    const [newDisplayName, setNewDisplayName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string| null >(null);

    const [user, setUser] = useState<User | null>(null);
    const googleProvider = new GoogleAuthProvider();

    const router = useRouter();
    const auth = getAuth(app);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        setLoading(true);
        if (firebaseUser) {
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
          });
          router.push('/home'); 
        } else {
          setUser(null);
        }
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, [router]);
  
    useEffect(() => {
      if (user && !loading) {
        router.push('/home');
      }
    }, [user, loading, router]);

    const login = async () => {
      try {
        setError(null);
        setLoading(true);
        await signInWithEmailAndPassword(auth, logEmail, logPassword);
      } catch (error) {
        if (error instanceof FirebaseError) {
          setError(getReadableErrorMessage(error.code));
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, initializeUser);
      return () => unsubscribe();
    }, []);


    useEffect(() => {
      if (user) {
        router.push('/home');
      } 
    }, [user, router]);


    async function initializeUser(user: any) {
      if(user){
        setUser({...user});
      } else{
        setUser(null);
      }
  
    }
    const handleGoogleLogin = async () => {
      try {
        setError(null);
        setLoading(true);
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        if (error instanceof FirebaseError) {
          setError(getReadableErrorMessage(error.code));
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  
    const register = async () => {
      try {
        setError(null);
        setLoading(true);
        await createUserWithEmailAndPassword(auth, resEmail, resPassword);
      } catch (error) {
        if (error instanceof FirebaseError) {
          setError(getReadableErrorMessage(error.code));
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
  

    const registerAndUpdateDisplayName = async () => {
      try {
        await register();
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updateProfile(currentUser, { displayName: newDisplayName });
        }
        setNewDisplayName("");
      } catch (error) {
        console.error("Error registering user:", error);
      }
    };

    if (loading) {
      return <Loader /> 
    }

    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          {/* <h1 className={styles.title}>Login</h1> */}
          {error && (
            <div className={styles.error}>
              <svg className={styles.errorIcon} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {error}
            </div>
          )}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Register</h2>
              <input
                className={styles.input}
                type="text"
                value={newDisplayName}
                placeholder="Name"
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={resEmail}
                onChange={(e) => setResEmail(e.target.value)}
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Password"
                value={resPassword}
                onChange={(e) => setResPassword(e.target.value)}
              />
              <button
                className={styles.button}
                onClick={registerAndUpdateDisplayName}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Login</h2>
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={logEmail}
                onChange={(e) => setLogEmail(e.target.value)}
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Password"
                value={logPassword}
                onChange={(e) => setLogPassword(e.target.value)}
              />
              <button className={styles.button} onClick={login}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <button className={styles.button} onClick={handleGoogleLogin}>
                {loading ? "Logging in..." : "Login with Google"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

  export default LoginPage;
