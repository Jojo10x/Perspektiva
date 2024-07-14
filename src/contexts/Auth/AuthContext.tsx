import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/Auth/useAuth';

interface AuthContextType {
  user: any;
  loading: boolean;
}

interface AuthProviderType {
   children: React.ReactNode;
  }

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<AuthProviderType> = ({ children }) => {
  const { user, loading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      setAuthChecked(true);
    }
  }, [loading]);

  useEffect(() => {
    if (authChecked) {
      const publicPages = ['/login', '/register', '/about']; // Add your public pages here
      const isPublicPage = publicPages.includes(router.pathname);

      if (!user && !isPublicPage) {
        router.push('/login');
      } else if (user && router.pathname === '/login') {
        router.push('/home');
      }
    }
  }, [authChecked, user, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {authChecked ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);