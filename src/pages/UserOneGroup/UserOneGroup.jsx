
// api
import { getUserOneGroup } from '../../api/user';

// hook
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import useRedirectSignIn from "../../utils/Private.jsx"

import Modal from 'react-modal';
import Swal from 'sweetalert2'
import dayjs from 'dayjs';

import { io } from 'socket.io-client';

//scss
import styles from "./UserOneGroup.module.scss";

// api
import { postRecord } from "../../api/accounting.js";
import { deleteRecord } from "../../api/accounting.js";
import { putRecord } from "../../api/accounting.js";

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
      const getGroupAsync = async () => {
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
      // 最後記得執行 getGroupAsync 這個function
      getGroupAsync();
    }
  }, [userId, gpId, token, isAuthenticated, redirectSignIn]);


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

  // 新增一筆紀錄用
  const [item, setItem] = useState("");
  const [lender, setLender] = useState("");
  const [borrower, setBorrower] = useState("");
  const [price, setPrice] = useState("");
  const [time, setTime] = useState(dayjs().format('YYYY-MM-DD'));

  const handleAddRecord = async () => {
    const newRecord = {
      item: item,
      lender: lender,
      borrower: borrower,
      price: price,
      time: time,
    };

    // 呼叫 postRecord 發送資料
    try {
      await postRecord(userId, gpId, newRecord, token);

      // 清空表單
      setItem('');
      setLender('');
      setBorrower('');
      setPrice('');
      setTime(dayjs().format('YYYY-MM-DD'));
    } catch (error) {
      Swal.fire({
        text: error.response.data.message,
        icon: "warning",
        timer: 2800,
        showConfirmButton: false,
      });
      console.error('新增紀錄失敗:', error);
    }
  };

  // 刪除一筆紀錄用
  const handleDeleteRecord = async (btnRecordId) => {
    try {
      const { data } = await deleteRecord(userId, gpId, btnRecordId, token);

      if (data.status === "success" && data.message === "已刪除該筆紀錄") {
        Swal.fire({
          title: "成功刪除紀錄",
          timer: 2100,
          icon: "success",
          showConfirmButton: false,
        })
      } else {
        Swal.fire({
          title: "刪除紀錄失敗",
          text: "出了一點錯誤",
          timer: 2100,
          icon: "warning",
          showConfirmButton: false,
        })
      }
    } catch (error) {
      console.error("刪除紀錄時出錯:", error);
    }
  };

  // 編輯一筆紀錄用
  const [isEditing, setIsEditing] = useState(false);  // 控制是否顯示編輯表單
  const [editRecord, setEditRecord] = useState(null);  // 存儲要編輯的紀錄

  const putOneRecord = (btnRecordId) => {
    // 查找要編輯的紀錄
    const recordToEdit = gpData.gpRecord.find(record => record._id === btnRecordId);

    if (recordToEdit) {
      // 將該紀錄的內容放到表單
      setItem(recordToEdit.item);
      setLender(recordToEdit.lender);
      setBorrower(recordToEdit.borrower);
      setPrice(recordToEdit.price);
      setTime(dayjs(recordToEdit.time).format('YYYY/M/D'));

      // 顯示編輯表單
      setEditRecord(recordToEdit);  // 儲存當前要編輯的紀錄
      setIsEditing(true);  // 顯示編輯表單
    }
  };

  // 更新紀錄
  const handleUpdateRecord = async () => {
    const updatedRecord = {
      item,
      lender,
      borrower,
      price,
      time
    };

    try {
      const response = await putRecord(userId, gpId, editRecord._id, updatedRecord, token);

      if (response.status === "success") {
        // 更新成功後清空狀態並關閉編輯表單
        setIsEditing(false);
        setEditRecord(null);
      } else {
        console.error('更新紀錄失敗');
      }
    } catch (error) {
      console.error('更新紀錄時發生錯誤:', error);
    }
  };

  // 取消編輯
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditRecord(null);
  };

  return (
    <div>
      <div className={styles.container}>

        <div className={styles.bookingContainer}>
          {gpData && <p>群組名稱 : {gpData.gpName}</p>}
          {gpData && <p>群組創建人 : {gpData.gpCreater}</p>}
          {gpData && gpData.gpMembers && gpData.gpMembers.length > 0 ? (
            <p>群組成員 : {gpData.gpMembers.join(', ')}</p>
          ) : <p>沒有群組成員</p>}

          <button className={styles.openChatBtn} onClick={handleJoinRoom} style={{ marginBottom: '6.5px' }} > 傳訊息給對方 </button>
          <button className={styles.openChatBtn} style={{ marginLeft: '6.5px' }} > 結算全部 </button>

          <div>
            <input
              className={styles.inputRow}
              type="text"
              placeholder="項目名稱"
              value={item} // 這裡儲存的是字串
              onChange={(e) => setItem(e.target.value)}
              name="item"
              required
            />

            <input
              className={styles.inputRow}
              type="text"
              placeholder="借出者"
              value={lender}
              onChange={(e) => setLender(e.target.value)}
              name="lender"
              required
            />

            <input
              className={styles.inputRow}
              type="text"
              placeholder="欠款者"
              value={borrower}
              onChange={(e) => setBorrower(e.target.value)}
              name="borrower"
              required
            />

            <input
              className={styles.inputRow}
              type="text"
              placeholder="價格"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              name="price"
              required
            />

            <input
              className={styles.inputRow}
              type="text"
              placeholder="時間"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              name="time"
              required
            />

            <button className={styles.openChatBtn} onClick={handleAddRecord} style={{ marginLeft: '6.5px' }} > 增加一筆紀錄 </button>
          </div>

          {gpData && gpData.gpRecord && gpData.gpRecord.length > 0 ? (
            <>
              <div className={styles.accountingTitle}>
                <h6 className={styles.item}>項目</h6>
                <h6 className={styles.lender}>借出者</h6>
                <h6 className={styles.borrower}>欠款者</h6>
                <h6 className={styles.price}>價格</h6>
                <h6 className={styles.time}>時間</h6>
                <h6 className={styles.edit}> 編輯 </h6>
                <h6 className={styles.delete}> 刪除 </h6>
              </div>
              {gpData.gpRecord.map(record => (
                <div className={styles.newBooking} key={record._id}>
                  <div className={styles.accountingList}>
                    <h6 className={styles.item}>{record.item}</h6>
                    <h6 className={styles.lender}>{record.lender}</h6>
                    <h6 className={styles.borrower}>{record.borrower}</h6>
                    <h6 className={styles.price}>{record.price}</h6>
                    <h6 className={styles.time}>{new Date(record.time).toLocaleDateString()}</h6>
                    <button className={styles.edit} onClick={() => putOneRecord(record._id)}> 編輯 </button>
                    <button className={styles.delete} onClick={() => handleDeleteRecord(record._id)} > 刪除 </button>
                  </div>
                </div>
              )
              )}
            </>
          ) :
            <p> 目前沒有任何記帳紀錄 </p>}
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

        <Modal
          isOpen={isEditing}  // 控制Modal顯示與隱藏
          contentLabel="Edit Record"
          className={styles.chatModal}
          overlayClassName={styles.chatOverlay}
        >
          <h2>編輯紀錄</h2>
          <div className={styles.editForm}>
            <input
              className={styles.inputRow}
              type="text"
              placeholder="項目名稱"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
            <input
              className={styles.inputRow}
              type="text"
              placeholder="借出者"
              value={lender}
              onChange={(e) => setLender(e.target.value)}
            />
            <input
              className={styles.inputRow}
              type="text"
              placeholder="欠款者"
              value={borrower}
              onChange={(e) => setBorrower(e.target.value)}
            />
            <input
              className={styles.inputRow}
              type="text"
              placeholder="價格"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              className={styles.inputRow}
              type="text"
              placeholder="時間"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <div className={styles.buttons}>
              <button onClick={handleUpdateRecord} className={styles.saveBtn}>更新紀錄</button>
              <button onClick={handleCancelEdit} className={styles.cancelBtn}>取消</button>
            </div>
          </div>
        </Modal>

      </div>
    </div >
  )
}
