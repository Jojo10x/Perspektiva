import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/contexts/Auth/AuthContext';
import Loader from '@/components/common/Loader/Loader';
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
    ];

    const isProtected = !publicRoutes.includes(router.pathname);

    useEffect(() => {
      console.log('withAuth effect', { 
        currentPath: router.pathname,
        isProtected,
        loading,
        user,
        publicRoutes
      });
      if (!loading) {
        if (!user && isProtected) {
          console.log('Attempting to redirect to login');
          router.replace("/login").catch(error => console.error('Router error:', error));
        } else if (user && router.pathname === '/login') {
          router.replace("/home").catch(error => console.error('Router error:', error));
        }
      }
    }, [user, loading, router, isProtected]);

    if (loading) return <Loader/>;
    if (!user && isProtected) return null;
    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuth;
};

export default withAuth;