# 記帳工具 accounting

## 前端技術堆疊

語言與框架：React.js
數據交換：Axios 用於向後端 API 發送 HTTP 請求並處理響應
雙向通訊：socket.io-client 實現即時通訊功能
身份認證：JWT（JSON Web Token）存儲和傳遞身份認證的 Token，確保用戶的認證狀態。

## 專案介紹

這是一個能夠幫助用戶，記錄與朋友彼此消費與欠款狀況的記帳工具。
可以新增、編輯和刪除記錄，根據所有記錄，計算最終的欠款結果。
用戶可建立群組，群組人數兩人為主，能一同做記帳的項目紀錄。
支持即時聊天功能，便於雙方即時交流欠款細節。

適用於想簡單清楚地紀錄管理借款與欠款狀況的用戶，並能夠促進更便捷的溝通。

## 功能介紹

帳號管理：
 - 註冊與登入：未登入時，用戶可註冊及登入帳號。登入後，根據用戶帳號展示現有群組及相關功能。
 - 登出：用戶可隨時登出帳號，退出後無法使用相關功能，直到重新登入。
群組管理：用戶可以建立群組，並填寫一名用戶加入群組。可將群組頁面連結分享給對方，與對方一起記帳。
記錄管理：可以新增、編輯和刪除借出、欠款紀錄。
欠款計算：結算單一群組的全部紀錄，計算最終的欠款金額，顯示誰欠誰多少錢。
即時聊天：如果雙方都在線，支持實時文字發送聊天訊息，便於討論和協商。

## 畫面截圖

![image](https://github.com/jolly01008/accounting-frontend/blob/main/public/readmeImage/image01.png)
![image](https://github.com/jolly01008/accounting-frontend/blob/main/public/readmeImage/image02.png)
![image](https://github.com/jolly01008/accounting-frontend/blob/main/public/readmeImage/image03.png)
![image](https://github.com/jolly01008/accounting-frontend/blob/main/public/readmeImage/image04.png)
![image](https://github.com/jolly01008/accounting-frontend/blob/main/public/readmeImage/image05.png)
![image](https://github.com/jolly01008/accounting-frontend/blob/main/public/readmeImage/image06.png)

## 共用帳號

- 第一組 user 帳號

  - email: user1@example.com
  - password: 12345678

- 第二組 user 帳號

  - email: user2@example.com
  - password: 12345678

- 第三組 user 帳號

  - email: user3@example.com
  - password: 12345678

# 安裝及使用

## 本地基礎設置

- 確認本地端已安裝 Node.js 、 npm

- 搭配後端 repo，作為伺服器
  <https://github.com/jolly01008/accounting>

## 開始使用

1. 將專案 clone 到本地

2. 開啟終端機(Terminal)，進入存放此專案的資料夾

```

cd accounting-frontend

```

3. 安裝所需套件

```

npm install

```

4. 安裝完畢，執行程式

```

npm start

```

5. 打開瀏覽器進入到以下網址：  
   http://localhost:3000/signin，共用帳號進行登入  
   http://localhost:3000/signup，或註冊其他帳號做登入  
   成功登入後即可開始使用功能

6. 若要暫停使用可以按下鍵盤

```

ctrl + c

```
