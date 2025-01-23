import { useAuth } from "../../contexts/AuthContext.jsx";

//scss
import styles from "./LogoutBtn.module.scss";


export default function LogoutBtn() {
  const { logout } = useAuth();

  const handleClick = () => {
    logout();
  };

  return (
    <div>
      <div onClick={handleClick} className={styles.barBtn}>
        <button className={styles.logoutBtn}>登出</button>
      </div>
    </div>

  )
}