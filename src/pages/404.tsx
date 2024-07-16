import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/components/Error/404.module.scss';

const Custom404: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.message}>Sorry, the page you are looking for does not exist.</p>
        <button className={styles.button} onClick={handleGoHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Custom404;
