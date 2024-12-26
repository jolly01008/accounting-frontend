
// api
import { getUserOneGroup } from '../../api/user';

// hook
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//components

//scss
import styles from "./UserOneGroup.module.scss";


export default function UserOneGroup() {

  const { userId, gpId } = useParams();
  console.log('userId:', userId)
  console.log('gpId:', gpId)

  // const [user, setUser] = useState(null);
  const [gpData, setGpData] = useState(null);

  // const token = localStorage.getItem("token");

  useEffect(() => {
    const getUserAsync = async () => {

      try {
        //後端拿到的資料存到 user
        const fetchGroup = await getUserOneGroup(userId, gpId);
        console.log('fetchGroup:', fetchGroup)
        setGpData(fetchGroup.data);
      } catch (error) {
        console.error(error);
      }
    };
    // 最後記得執行 getUserAsync 這個function
    getUserAsync();

  }, [userId, gpId]);
  console.log('gpData狀態有改變嗎:', gpData)
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
          {gpData && <h3>群組名稱 : {gpData.gpName}</h3>}
          <button>傳訊息給對方</button>
          <div className={styles.newBooking}>
            <h5 className={styles.title} style={{ fontWeight: 'bold' }}>該群組的紀錄項目</h5>
            <div className={styles.bookingTitle}>
              <h6 className={styles.bookingItem} style={{ marginTop: '6.5px' }}>項目</h6>
              <h6 className={styles.bookingItemDate} style={{ marginTop: '6.5px' }}>先付者</h6>
              <h6 className={styles.bookingItemPrice} style={{ marginTop: '6.5px' }}>欠款者</h6>
              <h6 className={styles.bookingItemTenant} style={{ marginTop: '6.5px' }}>價格</h6>
              <h6 className={styles.bookingItemBeds} style={{ marginTop: '6.5px' }}>時間</h6>
            </div>
            <div key={'booking.id'} className={styles.bookingList}>
              <h6 className={styles.bookingItem} style={{ marginTop: '6.5px' }}>機票錢</h6>
              <h6 className={styles.bookingItemDate} style={{ marginTop: '6.5px' }}>AAA</h6>
              <h6 className={styles.bookingItemPrice} style={{ marginTop: '6.5px' }}>BBB</h6>
              <h6 className={styles.bookingItemTenant} style={{ marginTop: '6.5px' }}>$ 14000</h6>
              <h6 className={styles.bookingItemBeds} style={{ marginTop: '6.5px' }}>$ 14000</h6>
              {/* {booking.bedRecords ?
                <h6 className={styles.bookingItemBeds}>{booking.bedRecords.join(', ')} </h6> :
                <h6 className={styles.bookingItemBeds}> (套房不分床位)</h6>} */}
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}
