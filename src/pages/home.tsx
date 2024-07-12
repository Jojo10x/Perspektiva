import React, { useEffect } from 'react';
import styles from '../../src/styles/components/Home/HomeView.module.scss';
import QuoteRotator from '../components/Quotes/QuoteRotator';
import Name from '../components/common/Name/Name';
import HabitText from '../components/HomeViews/Habit/HabitText';
import PlansText from '../components/HomeViews/Plans/PlansText';
import SettingsText from '../components/HomeViews/SettingsView/SettingsText';
import AboutText from '../components/HomeViews/About/AboutText';
import GoalsText from '@/components/HomeViews/Goals/Goals';

const HomeView: React.FC = () => {
    useEffect(() => {
      const initializeStickyNavigation = () => {
        class StickyNavigation {
          currentId: string | null;
          currentTab: HTMLElement | null;
          tabContainerHeight: number;
  
          constructor() {
            this.currentId = null;
            this.currentTab = null;
            this.tabContainerHeight = 70;
            document.querySelectorAll(`.${styles['et-hero-tab']}`).forEach((tab) =>
              tab.addEventListener('click', (event) => this.onTabClick(event, tab as HTMLElement))
            );
            window.addEventListener('scroll', this.onScroll.bind(this));
            window.addEventListener('resize', this.onResize.bind(this));
          }
  
          onTabClick(event: Event, element: HTMLElement) {
            event.preventDefault();
            const href = element.getAttribute('href');
            if (href) {
              const targetElement = document.querySelector(href) as HTMLElement;
              if (targetElement) {
                const scrollTop = targetElement.offsetTop - this.tabContainerHeight + 1;
                window.scrollTo({ top: scrollTop, behavior: 'smooth' });
              }
            }
          }
  
          onScroll() {
            this.checkTabContainerPosition();
            this.findCurrentTabSelector();
          }
  
          onResize() {
            if (this.currentId) {
              this.setSliderCss();
            }
          }
  
          checkTabContainerPosition() {
            const heroTabsElement = document.querySelector(`.${styles['et-hero-tabs']}`) as HTMLElement;
            const heroTabsContainerElement = document.querySelector(`.${styles['et-hero-tabs-container']}`) as HTMLElement;
  
            if (heroTabsElement && heroTabsContainerElement) {
              const offset =
                heroTabsElement.offsetTop + heroTabsElement.offsetHeight - this.tabContainerHeight;
              if (window.scrollY > offset) {
                heroTabsContainerElement.classList.add(styles['et-hero-tabs-container--top']);
              } else {
                heroTabsContainerElement.classList.remove(styles['et-hero-tabs-container--top']);
              }
            }
          }
  
          findCurrentTabSelector() {
            let newCurrentId: string | null = null;
            let newCurrentTab: HTMLElement | null = null;
  
            document.querySelectorAll(`.${styles['et-hero-tab']}`).forEach((tab) => {
              const id = tab.getAttribute('href');
              if (id) {
                const targetElement = document.querySelector(id) as HTMLElement;
                if (targetElement) {
                  const offsetTop = targetElement.offsetTop - this.tabContainerHeight;
                  const offsetBottom = targetElement.offsetTop + targetElement.offsetHeight - this.tabContainerHeight;
                  if (window.scrollY > offsetTop && window.scrollY < offsetBottom) {
                    newCurrentId = id;
                    newCurrentTab = tab as HTMLElement;
                  }
                }
              }
            });
  
            if (this.currentId !== newCurrentId || this.currentId === null) {
              this.currentId = newCurrentId;
              this.currentTab = newCurrentTab;
              this.setSliderCss();
            }
          }
  
          setSliderCss() {
            if (this.currentTab) {
              const slider = document.querySelector(`.${styles['et-hero-tab-slider']}`) as HTMLElement;
              if (slider) {
                slider.style.width = `${this.currentTab.offsetWidth}px`;
                slider.style.left = `${this.currentTab.offsetLeft}px`;
              }
            }
          }
        }
  
        new StickyNavigation();
      };
  
      initializeStickyNavigation();
  
    }, []);
  return (
    <div>
      <section className={styles['et-hero-tabs']}>
        <h1><Name/></h1>
        <h3><QuoteRotator/></h3>
        <div className={styles['et-hero-tabs-container']}>
          
          <a className={styles['et-hero-tab']} href="#tab-flexbox">
            Habit
          </a>
          <a className={styles['et-hero-tab']} href="#tab-react">
            Plans
          </a>
          <a className={styles['et-hero-tab']} href="#tab-other">
            Goals
          </a>
          <a className={styles['et-hero-tab']} href="#tab-angular">
            Settings
          </a>
          <a className={styles['et-hero-tab']} href="#tab-es6">
            About
          </a>
          
          <span className={styles['et-hero-tab-slider']}></span>
        </div>
      </section>

      <main className={styles['et-main']}>
       
        <section className={styles['et-slide']} id="tab-flexbox">
        <HabitText/>
        </section>
        <section className={styles['et-slide']} id="tab-react">
        <PlansText/>
        </section>
        <section className={styles['et-slide']} id="tab-other">
          <GoalsText/>
        </section>
        <section className={styles['et-slide']} id="tab-angular">
        <SettingsText/>
        </section>
        <section className={styles['et-slide']} id="tab-es6">
        <AboutText/>
        </section>
      </main>
    </div>
  );
};

export default HomeView;