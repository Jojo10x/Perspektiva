import { useWeekNavigation } from '@/types/useWeekNavigation';
import { PlansProvider } from '../contexts/Plans/PlansContext';
import './globals.css'; 
import { AppProps } from 'next/app';
import { useAuth } from '@/hooks/Auth/useAuth';
import { AuthProvider } from '@/contexts/Auth/AuthContext';
import withAuth from '@/utils/withAuth';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const { currentWeek } = useWeekNavigation();
  const router = useRouter();
  const publicRoutes = [
    "/login",
    "/settings",
    "/goals",
    "/habitlist",
    "/habits",
    "/history",
    "/plans",
  ];

  const isProtectedRoute = !publicRoutes.includes(router.pathname);

  const AuthenticatedComponent = withAuth(Component, isProtectedRoute);

  return (
    <AuthProvider>
      <PlansProvider currentWeek={currentWeek}>
        <title>Perspektiva</title>
        <link rel="icon" href="/flexed-biceps.svg" />
        <AuthenticatedComponent {...pageProps} />
      </PlansProvider>
    </AuthProvider>
  );
}

export default MyApp;
