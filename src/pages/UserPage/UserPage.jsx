
// api
import { getUserPage } from '../../api/user';

// hook
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import useRedirectSignIn from "../../utils/Private.jsx"

//scss
import styles from "./UserPage.module.scss";


export default function UserPage() {

  const { userId } = useParams();
  const { isAuthenticated } = useAuth();

  const redirectSignIn = useRedirectSignIn();
  console.log('userId:', userId)
  // console.log('gpId:', gpId)

  const [userData, setUserData] = useState(null);
  const [gpsData, setGpsData] = useState(null);

  // const token = localStorage.getItem("token");

  const token = localStorage.getItem("token");
  console.log('token:', token)


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
  // console.log('userData狀態有改變嗎:', userData)
  console.log('gpsData狀態:', gpsData)
  return (
    <div>
      <div className={styles.container}>
        {/* <div className={styles.selfIntroContainer}>
          <div className={styles.avatar}>
            <img className={styles.img} src={landlordData.avatar} alt="" />
          </div>

          <div className={styles.introduction}>
            <h5 className={styles.aboutMe} style={{ fontWeight: 'bold' }}>關於我</h5>
            <h6>{landlordData.introduction}</h6>
          </div>

          <div className={styles.basicInformContainer}>
            <ul className={styles.basicInform}>
              <li><h6>顯示姓名 : {landlordData.name}</h6></li>
              <li><h6>聯絡電話 : {landlordData.phone}</h6></li>
              <li><h6>居住城市 :  {landlordData.country}</h6></li>
            </ul>
          </div>

          <div>
            <a href={`/landlords/${landlordId}/editLandlord`}>
              <button type="submit" className={styles.btn}>編輯資料</button>
            </a>
          </div>
        </div> */}

        <div className={styles.bookingContainer}>
          {userData && <h2>Hi， {userData.name}</h2>}
          <h4>我的群組</h4>
          {gpsData && gpsData.map(group => {
            console.log('group:', group)
            return (
              <div key={group._id}>
                <p>
                  <a href={`${userId}/groups/${group._id}`}>
                    {/* <a href={`6757e561db2b9a8665a63f0d/groups/6758ebc349ba35f1f921e504`}> */}
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
