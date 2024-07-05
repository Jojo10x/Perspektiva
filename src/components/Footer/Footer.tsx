import styles from "../../styles/Footer.module.scss";
const Footer = () => {
  const currYear = new Date().getFullYear();
  return (
    <footer>
      <div className={styles.subTitle}>
        {currYear} | Lux Shoes. All Rights Reserved. Built by |
        <a href="https://joelkasisi.netlify.app/">
          <span>Joel Kasisi</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
