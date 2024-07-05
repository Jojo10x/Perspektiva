import React, { useState, useEffect } from 'react';
import { auth} from '../../../Firebase-config'

const DisplayName: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName || "");
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{displayName}</>;
};

export default DisplayName;
