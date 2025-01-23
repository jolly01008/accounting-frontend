import axios from 'axios';

const authURL = 'http://localhost:3001/api'

export const login = async ({ account, password }) => {
  try {
    const { data } = await axios.post(`${authURL}/users/login`, {
      account,
      password
    })

    const { token } = data;

    if (token) {
      return { success: true, ...data }
    }

    return data; //如果沒有token，就回傳data

  } catch (error) {
    console.error('[Siginin Failed]:', error)
    return { success: false }
  }
};

export const register = async ({
  name,
  account,
  password,
  checkPassword
}) => {
  try {
    const { data } = await axios.post(`${authURL}/users/register`, {
      name,
      account,
      password,
      checkPassword,
    });

    return data;
  } catch (error) {
    console.error("[Signup Failed]: ", error);
    return error;
  }
};