import styles from '../../styles/components/Home/HomeView.module.scss';

interface TabContentProps {
  id: string;
  children: React.ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ id, children }) => (
  <section className={styles['et-slide']} id={id}>
    {children}
  </section>
);

export default TabContent;