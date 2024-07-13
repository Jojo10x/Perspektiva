import { useEffect, useState } from 'react';
import {  User, onAuthStateChanged } from 'firebase/auth';
import {auth} from '../../../Firebase-config';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return currentUser;
};


