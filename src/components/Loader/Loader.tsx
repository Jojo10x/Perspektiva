import React from 'react';
import styles from "../../styles/Loader.module.scss";
import PacmanLoader from 'react-spinners/PacmanLoader';
const Loader: React.FC = () => {
  return (
    
    <div className={styles.loader_container}>
    <PacmanLoader color="black" loading={true} size={70} />
  </div>
  );
};

export default Loader;
