
// api
import { getUserPage } from '../../api/user';

// hook
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import useRedirectSignIn from "../../utils/Private.jsx"

//scss
import styles from "./UserPage.module.scss";

//component
import LogoutBtn from "../../components/LogoutBtn/LogoutBtn.jsx";

export default function UserPage() {

  const { userId } = useParams();
  const { isAuthenticated } = useAuth();

  const redirectSignIn = useRedirectSignIn();

  const [userData, setUserData] = useState(null);
  const [gpsData, setGpsData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { redirectSignIn() }

    if (isAuthenticated) {
      const getUserAsync = async () => {
        try {
          //後端拿到的資料存到 user
          const fetchData = await getUserPage(userId, token);
          console.log('fetchData:', fetchData)
          setUserData(fetchData.userData);
          setGpsData(fetchData.gpsData)
        } catch (error) {
          console.error(error);
        }
      };
      // 最後記得執行 getUserAsync 這個function
      getUserAsync();
    }
  }, [userId, token, isAuthenticated, redirectSignIn]);
  console.log('gpsData狀態:', gpsData)
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.bookingContainer}>
          <LogoutBtn></LogoutBtn>
          {userData && <h2>Hi， {userData.name}</h2>}
          <h4>我的群組</h4>

          {gpsData && gpsData.map(group => {
            console.log('group:', group)
            return (
              <div key={group._id}>
                <p>
                  <a href={`${userId}/groups/${group._id}`}>
                    {group.gpName}
                  </a>
                  &nbsp;- 群組成員: {group.gpMembers}
                </p>
              </div>)
          })}
        </div>


      </div>
    </div >
  )
}
