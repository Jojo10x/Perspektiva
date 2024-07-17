import React, {  useState } from 'react';
import "./globals.css";
import styles from '../styles/components/Auth/Login.module.scss';
import Loader from '@/components/common/Loader/Loader';
import { useAuth } from '../hooks/Auth/useAuth';
import { useAuthContext } from '@/contexts/Auth/AuthContext';
import { useRouter } from 'next/router';

export default function LoginPage () {
  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const [resEmail, setResEmail] = useState("");
  const [resPassword, setResPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");

  const { loading, error, login, loginWithGoogle, register } = useAuth();
  const { user } = useAuthContext();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  if (user) {
    router.push('/Home');
    return null;
  }

  const handleRegister = async () => {
    await register(resEmail, resPassword, newDisplayName);
    setNewDisplayName("");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
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
              onClick={handleRegister}
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
            <button className={styles.button} onClick={() => login(logEmail, logPassword)}>
              Login
            </button>
            <button className={styles.button} onClick={loginWithGoogle}>
              Login with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



