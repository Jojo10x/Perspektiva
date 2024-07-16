import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/contexts/Auth/AuthContext';
import Loader from '@/components/common/Loader/Loader';
const withAuth = (
  WrappedComponent: React.ComponentType,
  isProtected: boolean = true
) => {
  const WithAuth = (props: any) => {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user && isProtected && router.pathname !== '/login'){
        console.log("Redirecting to login", { loading, user, isProtected });
        router.replace("/login").catch(console.error);
      }
      console.log('withAuth effect', { 
        loading, 
        user, 
        isProtected, 
        currentPath: router.pathname 
      });
    }, [user, loading, router]);

    if (loading) return <Loader/>;
    if (!user && isProtected) return null;
    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuth;
};

function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default withAuth;