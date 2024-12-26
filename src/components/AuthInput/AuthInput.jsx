import styles from "./AuthInput.module.scss"

export default function AuthInput ({ type, label, value, placeholder, onChange
}) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label} &nbsp; </label>
      <input className={styles.input} 
            type={type || 'text'}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange?.(event.target.value)}
      />
    </div>
  )
}