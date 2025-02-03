
// api
import { getUserPage } from '../../api/user';

// hook
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import useRedirectSignIn from "../../utils/Private.jsx"

import Swal from 'sweetalert2'
//scss
import styles from "./UserPage.module.scss";

//component
import LogoutBtn from "../../components/LogoutBtn/LogoutBtn.jsx";
import Modal from 'react-modal';

//api
import { postGroup } from "../../api/accounting.js";

export default function UserPage() {

  const { userId } = useParams();
  const { isAuthenticated } = useAuth();

  const redirectSignIn = useRedirectSignIn();

  const [userData, setUserData] = useState(null);
  const [gpsData, setGpsData] = useState(null);

  const token = localStorage.getItem("token");

  const [isEditing, setIsEditing] = useState(false);  // 控制是否顯示編輯表單
  const [gpName, setGpName] = useState("");
  const [gpMemberName, setGpMemberName] = useState("");

  const addGroupModal = async () => {
    try {
      setIsEditing(true);  // 顯示表單
    } catch (error) {
      console.error('新增群組失敗:', error);
    }
  };

  // 取消編輯
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleAddGroup = async () => {
    const groupData = {
      gpName: gpName,
      gpMemberName: gpMemberName
    };

    // 呼叫 postGroup 發送資料
    try {
      await postGroup(userId, groupData, token);

      setIsEditing(true);  // 顯示表單

      // 清空表單
      setGpName('');
      setGpMemberName('');
      setIsEditing(false);
    } catch (error) {
      Swal.fire({
        text: error.response.data.message,
        icon: "warning",
        timer: 2800,
        showConfirmButton: false,
      });
      console.error('新增群組失敗:', error);
    }
  };

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
                  &nbsp;- 群組成員: {group.gpMembers.join(',')}
                </p>
              </div>)
          })}
          <button className={styles.addBtn} onClick={addGroupModal}>新增群組</button>
        </div>

        <Modal
          isOpen={isEditing}  // 控制Modal顯示與隱藏
          contentLabel="Edit Record"
          className={styles.chatModal}
          overlayClassName={styles.chatOverlay}
        >
          <h2>新增群組</h2>
          <div className={styles.editForm}>
            <input
              className={styles.inputRow}
              type="text"
              placeholder="群組名稱"
              value={gpName}
              onChange={(e) => setGpName(e.target.value)}
            />
            <input
              className={styles.inputRow}
              type="text"
              placeholder="寫一位一起記帳的成員名字"
              value={gpMemberName}
              onChange={(e) => setGpMemberName(e.target.value)}
            />
          </div>
          <div className={styles.buttons}>
            <button onClick={handleAddGroup} className={styles.saveBtn}>新增群組</button>
            <button onClick={handleCancelEdit} className={styles.cancelBtn}>取消</button>
          </div>
        </Modal>

      </div>
    </div >
  )
}
