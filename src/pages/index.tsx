import React from 'react';
import styles from '../../src/styles/components/Home/HomeView.module.scss';
import QuoteRotator from '../components/Quotes/QuoteRotator';
import Name from '../components/common/Name/Name';
import HabitText from '../components/HomeViews/Habit/HabitText';
import PlansText from '../components/HomeViews/Plans/PlansText';
import SettingsText from '../components/HomeViews/SettingsView/SettingsText';
import AboutText from '../components/HomeViews/About/AboutText';
import GoalsText from '@/components/HomeViews/Goals/Goals';
import StickyNavigation from '@/components/StickyNavigation/StickyNavigation';
import Tab from '@/components/Tab/Tab';
import TabContent from '@/components/Tab/TabContent';
import { useAuthContext } from '@/contexts/Auth/AuthContext';
import { useRouter } from 'next/router';
import Loader from '@/components/common/Loader/Loader';


const TAB_CONTAINER_HEIGHT = 70;

const tabs = [
  { href: '#tab-flexbox', label: 'Habit', content: <HabitText /> },
  { href: '#tab-react', label: 'Plans', content: <PlansText /> },
  { href: '#tab-other', label: 'Goals', content: <GoalsText /> },
  { href: '#tab-angular', label: 'Settings', content: <SettingsText /> },
  { href: '#tab-es6', label: 'About', content: <AboutText /> },
];

const HomeView: React.FC = () => {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  if (loading) return <Loader/>;
  if (!user) {
    router.push('/Login');
    return null;
  }
  return (
    <div>
      <StickyNavigation tabContainerHeight={TAB_CONTAINER_HEIGHT} />
      <section className={styles['et-hero-tabs']}>
        <h1><Name /></h1>
        <h3><QuoteRotator /></h3>
        <div className={styles['et-hero-tabs-container']}>
          {tabs.map((tab) => (
            <Tab key={tab.href} href={tab.href} label={tab.label} />
          ))}
          <span className={styles['et-hero-tab-slider']}></span>
        </div>
      </section>

      <main className={styles['et-main']}>
        {tabs.map((tab) => (
          <TabContent key={tab.href} id={tab.href.slice(1)}>
            {tab.content}
          </TabContent>
        ))}
      </main>
    </div>
  );
};

export default HomeView;
