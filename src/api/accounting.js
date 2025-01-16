import axios from 'axios';

const baseURL = 'http://localhost:3001/api'

export const postRecord = async (userId, gpId, newRecord, token) => {

  try {
    const response = await axios.post(`${baseURL}/accounting/${userId}/${gpId}/addRecord`,
      newRecord,
      {
        headers: {
          'Content-Type': 'application/json', // 設定請求的 Content-Type 為 JSON
          Authorization: "Bearer " + token,
        },
      }
    );
    const { data } = response;
    return data;

  } catch (error) {
    console.log("postRecord  is Fail", error);
    throw error;
  }
};