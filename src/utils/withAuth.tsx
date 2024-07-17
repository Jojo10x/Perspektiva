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
      "/Login",
      "/settings",
      "/goals",
      "/habitlist",
      "/habits",
      "/history",
      "/plans",
      "/404",
    ];

    const isProtectedRoute = !publicRoutes.includes(router.pathname);

    useEffect(() => {
      if (!loading) {
        if (!user && isProtectedRoute) {
          router.push("/Login").catch(error => {
            console.error('Router error:', error);
            window.location.href = '/Login'; 
          });
        } else if (user && router.pathname === '/Login') {
          router.push("/home").catch(error => {
            console.error('Router error:', error);
            window.location.href = '/home';
          });
        }
      }
    }, [user, loading, router, isProtectedRoute]);

    if (loading) return <Loader/>;
    if (!user && isProtectedRoute) return null;
    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithAuth;
};

export default withAuth;