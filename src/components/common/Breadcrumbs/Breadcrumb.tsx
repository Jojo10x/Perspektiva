import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { breadcrumbsData } from "../../../types/BreadcrumbsData";
import styles from "../../../styles/components/Breadcrumb/Breadcrumb.module.scss";

const Breadcrumb = () => {
  const router = useRouter();
  const { pathname } = router;

  const crumbs = breadcrumbsData[pathname] || [];

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.breadcrumb__list}>
      {crumbs.map((crumb, index) => (
          <li key={index} className={styles.breadcrumb__item}>
            {crumb.path ? (
              <Link href={crumb.path}>
               <span  className={styles.breadcrumb__link}>{crumb.name}</span> 
              </Link>
            ) : (
              <span className={styles.breadcrumb__current}>{crumb.name}</span>
            )}
            {index < crumbs.length - 1 && <span className={styles.breadcrumb__separator}> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
