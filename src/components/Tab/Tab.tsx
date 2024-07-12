import styles from '../../styles/components/Home/HomeView.module.scss';

interface TabProps {
  href: string;
  label: string;
}

const Tab: React.FC<TabProps> = ({ href, label }) => (
  <a className={styles['et-hero-tab']} href={href}>
    {label}
  </a>
);

export default Tab;