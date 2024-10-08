import { useWeekNavigation } from '@/types/useWeekNavigation';
import { PlansProvider } from '../contexts/Plans/PlansContext';
import './globals.css'; 
import { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/Auth/AuthContext';
import withAuth from '@/utils/withAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  console.log('Rendering _app with pathname:', useRouter().pathname);
  const { currentWeek } = useWeekNavigation();
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      console.log('App is changing to: ', url)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  const AuthenticatedComponent = withAuth(Component);

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
