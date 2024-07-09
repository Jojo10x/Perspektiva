import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut,updateProfile,getAuth, signInWithPopup,  GoogleAuthProvider} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import "./globals.css";
import app from '../../Firebase-config';
import styles from '../styles/Login.module.scss';
import Loader from '@/components/Loader/Loader';

interface User {
    id: string;
    name: string;
    email: string;
  }
  
  const LoginPage: React.FC = () => {
    const [logEmail, setLogEmail] = useState("");
    const [logPassword, setLogPassword] = useState("");
    const [resEmail, setResEmail] = useState("");
    const [resPassword, setResPassword] = useState("");
    const [newDisplayName, setNewDisplayName] = useState("");
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<User | null>(null);
    const googleProvider = new GoogleAuthProvider();
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const auth = getAuth(app);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
  
      setMounted(true);
  
      return () => unsubscribe();
    }, []);
  
    useEffect(() => {
      if (user && !loading) {
        router.push('/home');
      }
    }, [user, loading, router]);

    const login = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          logEmail,
          logPassword
        );
        console.log("Logged in:", userCredential.user);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    const handleUserStateChange = async (firebaseUser: any) => {
      if (firebaseUser) {
        const mappedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
        };
        setUser(mappedUser);
      } else {
        setUser(null);
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
        const result = await signInWithPopup(auth, googleProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log("Google login successful:", user);
      } catch (error: any) {
        console.error("Error with Google login:", error.message);
      }
    }
    const register = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          resEmail,
          resPassword
        );
        console.log(userCredential);
      } catch (error: any) {
        console.log(error.message);
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

    if (loading || !mounted) {
      return <Loader /> // or any loading indicator
    }

    return (
      <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>
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
              Register
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
              Login
            </button>
            <button className={styles.button} onClick={handleGoogleLogin}>
              Login with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

  export default LoginPage;
