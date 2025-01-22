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

export const deleteRecord = async (userId, gpId, btnRecordId, token) => {
  try {
    const response = await axios.delete(`${baseURL}/accounting/${userId}/${gpId}/${btnRecordId}/deleteRecord`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response;

  } catch (error) {
    console.log("deleteRecord  is Fail", error);
    throw error;
  }
};
export const putRecord = async (userId, gpId, btnRecordId, updatedRecord, token) => {
  try {
    const response = await axios.put(`${baseURL}/accounting/${userId}/${gpId}/${btnRecordId}/putRecord`,
      {
        item: updatedRecord.item,
        lender: updatedRecord.lender,
        borrower: updatedRecord.borrower,
        price: updatedRecord.price,
        time: updatedRecord.time,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          'Content-Type': 'application/json',
        },
      }
    );

    const { data } = response;
    return data;

  } catch (error) {
    console.log("putRecord is Fail", error);
    throw error;
  }
};

export const countRecord = async (userId, gpId, token) => {

  try {
    const response = await axios.post(`${baseURL}/accounting/${userId}/${gpId}/countRecord`,
      {},
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
    console.log("countRecord  is Fail", error);
    throw error;
  }
};