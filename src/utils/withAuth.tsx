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
      if (!loading && !user && isProtected) {
        console.log("Redirecting to login", { loading, user, isProtected });
        router.replace("/login").catch(console.error);
      }
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