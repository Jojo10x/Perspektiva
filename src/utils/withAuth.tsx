import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/contexts/Auth/AuthContext';
const withAuth = (WrappedComponent: React.ComponentType, isProtected: boolean = true) => {
  return (props: any) => {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user && isProtected) {
        router.replace('/login');
      }
    }, [user, loading, router, isProtected]);

    if (loading) return <div>Loading...</div>;
    if (!user && isProtected) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;