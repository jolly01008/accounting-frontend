
// api
import { getUserOneGroup } from '../../api/user';

// hook
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import useRedirectSignIn from "../../utils/Private.jsx"

import Modal from 'react-modal';
import Swal from 'sweetalert2'

import { io } from 'socket.io-client';

//scss
import styles from "./UserOneGroup.module.scss";


export default function UserOneGroup() {

  const { userId, gpId } = useParams();
  const { isAuthenticated } = useAuth();
  const redirectSignIn = useRedirectSignIn();

  console.log('userId:', userId)
  console.log('gpId:', gpId)

  // const [user, setUser] = useState(null);
  const [gpData, setGpData] = useState(null);

  // 聊天相關
  const [socket, setSocket] = useState(null);   // 用來存儲 WebSocket 連接
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messageContainerRef = useRef(null);  // 使用 ref 引用 messageContainer (取代document.getElementById)

  const token = localStorage.getItem("token");
  console.log('token :', token)

  useEffect(() => {
    if (!token) { redirectSignIn() }

    if (isAuthenticated) {
      const getUserAsync = async () => {
        try {
          //後端拿到的資料存到 user
          const fetchGroup = await getUserOneGroup(userId, gpId, token);
          console.log('fetchGroup:', fetchGroup)
          setGpData(fetchGroup.data);
          // setUser(fetchGroup.user)
        } catch (error) {
          console.error(error);
        }
      };
      // 最後記得執行 getUserAsync 這個function
      getUserAsync();
    }
  }, [userId, gpId, token, isAuthenticated, redirectSignIn]);

  // console.log('user;', user)
  // 點擊進入聊天室按鈕。於此創建 WebSocket 連接
  const handleJoinRoom = () => {
    const socketInstance = io("http://localhost:3001");
    setSocket(socketInstance); // 存儲 socket 實例

    setIsOpen(true); // 顯示 Modal

    // 加入聊天室
    socketInstance.emit("joinRoom", { gpMembers: gpData.gpMembers });

    // 監聽其他成員加入聊天室
    socketInstance.on("otherJoined", data => {
      const { broadcast } = data

      if (broadcast) {
        Swal.fire({
          position: "top",
          text: broadcast,
          confirmButtonText: 'OK',
          timer: 2500
        })
        appendMessage(`( ${broadcast} )`)
      }
    })

    socketInstance.on("room-message", data => {
      const needBroadcastMsg = data.message
      appendMessage(`${data.fromSocketId} : ${needBroadcastMsg}`)
    })

    socketInstance.on("user-disconnected", data => {
      appendMessage(`( ${data} )`)
    })
  };

  // 點擊退出聊天室按鈕
  const handleCloseChat = () => {
    if (socket) {
      socket.disconnect(); // 只需要呼叫 socket.disconnect() 來關閉連接
      setSocket(null); // 清空 socket 狀態
    }

    setIsOpen(false); // 關閉 Modal
  };

  // 傳送聊天訊息
  const handleSendMessage = () => {
    const roomMembers = gpData.gpMembers

    appendMessage(`You : ${message}`)
    socket.emit('send-room-message', ({ roomMembers, message }))
    setMessage('');
  };

  // 把從伺服器接emit過來、所收到的聊天訊息加在畫面container 的function
  function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message

    // 添加 SCSS 類
    messageElement.classList.add(styles.messageLine);

    messageContainerRef.current.appendChild(messageElement); // 使用 ref 來操作 DOM
  }

  return (
    <div>
      <div className={styles.container}>

        <div className={styles.bookingContainer}>
          {gpData && <h3>群組名稱 : {gpData.gpName}</h3>}
          <button className={styles.openChatBtn} onClick={handleJoinRoom}> 傳訊息給對方 </button>

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
            </div>
          </div>
        </div>

        <Modal
          isOpen={isOpen}
          contentLabel="Chat Window"
          ariaHideApp={false} // For accessibility purposes (optional)
          className={styles.chatModal}
          overlayClassName={styles.chatOverlay}
        >
          <h2>開始聊天</h2>

          <div className={styles.chatBody}>
            {/* <div id="messageContainer"></div> */}
            <div ref={messageContainerRef}></div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows="5"
              className={styles.messageInput}
            />
            <button className={styles.sendBtn} onClick={handleSendMessage}>Send</button>
          </div>
          <div className={styles.chatHeader}>
            <button className={styles.closeBtn} onClick={handleCloseChat}>結束對話</button>
          </div>

        </Modal>

        <div>
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
        </div>
      </div>
    </div>
  )
}
