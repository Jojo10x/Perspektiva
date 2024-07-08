import { useWeekNavigation } from '@/types/useWeekNavigation';
import { PlansProvider } from '../contexts/Plans/PlansContext';
import './globals.css'; 
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps}: AppProps) {
  console.log('_app.tsx rendered');
  const { currentWeek } = useWeekNavigation();
  return (
    <PlansProvider currentWeek={currentWeek}>
      <Component {...pageProps} />
    </PlansProvider>
  );
}


export default MyApp;
