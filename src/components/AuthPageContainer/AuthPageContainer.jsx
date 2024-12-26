import styles from "./AuthPageContainer.module.scss";

export default function AuthPageContainer ({children, title}) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.AuthInputContainer}>
        {children}
      </div>
    </div>
  )
}