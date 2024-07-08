import { useWeekNavigation } from '@/types/useWeekNavigation';
import { PlansProvider } from '../contexts/Plans/PlansContext';
import './globals.css'; 
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps}: AppProps) {
  const { currentWeek } = useWeekNavigation();
  return (
    <PlansProvider currentWeek={currentWeek}>
      <Component {...pageProps} />
    </PlansProvider>
  );
}


export default MyApp;
