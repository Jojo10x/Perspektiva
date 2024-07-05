import React from 'react';
import "./globals.css";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { auth} from '../../Firebase-config'
import { updateProfile} from 'firebase/auth'
import { useEffect, useState } from 'react';
import styles from "../styles/Settings.module.scss";
import LogOut from '@/components/LogOut/LogOut';

const SettingsPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setDisplayName(user.displayName || '');
      }
    });

    return () => unsubscribe();
  }, []);

  const updateDisplayName = () => {
    const user = auth.currentUser;
    console.log(user)
    if (user) {
      updateProfile(user, {
        displayName: newDisplayName 
      }).then(() => {
        setDisplayName(newDisplayName);
        setNewDisplayName('');
      }).catch(error => {
        console.error('Error updating display name:', error);
      });
    }
  };

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewDisplayName(event.target.value);
  };


  return (
    <div className={styles.container}>
    <Breadcrumb />
    <div className={styles.content}>
      <h1 className={styles.title}>Settings Page</h1>
      <p className={styles.currentName}>Current Display Name: {displayName}</p>
      <div className={styles.updateSection}>
        <input 
          type="text" 
          value={newDisplayName} 
          onChange={handleChange} 
          className={styles.input}
          placeholder="New Display Name"
        />
        <button 
          onClick={updateDisplayName}
          className={styles.button}
        >
          Update Name
        </button>
      </div>
      
      <LogOut/>
    </div>
   
  </div>
);
};

export default SettingsPage;

