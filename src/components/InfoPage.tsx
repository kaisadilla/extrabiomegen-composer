import styles from './InfoPage.module.scss';

export interface InfoPageProps {
  children: React.ReactNode;
}

function InfoPage ({
  children,
}: InfoPageProps) {

  return (
    <div className={styles.infoPage}>
      {children}
    </div>
  );
}

export default InfoPage;
