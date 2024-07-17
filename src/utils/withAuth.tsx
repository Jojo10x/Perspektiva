import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/contexts/Auth/AuthContext';
import Loader from '@/components/common/Loader/Loader';
import LoginPage from '@/pages/login';
function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuth = (props: any) => {
    const { user, loading } = useAuthContext();
    const router = useRouter();
    const publicRoutes = [
      "/login",
      "/settings",
      "/goals",
      "/habitlist",
      "/habits",
      "/history",
      "/plans",
      "/404",
      "/[[...slug]]",
    ];

    const isProtectedRoute = !publicRoutes.includes(router.pathname);

    useEffect(() => {
      if (!loading) {
        if (!user && isProtectedRoute) {
          router.push("/login").catch(error => {
            console.error('Router error:', error);
            window.location.href = '/login'; 
          });
        } else if (user && router.pathname === '/login') {
          router.push("/home").catch(error => {
            console.error('Router error:', error);
            window.location.href = '/home';
          });
        }
      }
    }, [user, loading, router, isProtectedRoute]);

    if (loading) return <Loader/>;
    if (!user && isProtectedRoute) return <LoginPage />; 
    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuth;
};

export default withAuth;