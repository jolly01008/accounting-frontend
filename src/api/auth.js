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

// export const register = async ({
//   name,
//   email,
//   password,
//   confirmPassword
// }) => {
//   try {
//     const { data } = await axios.post(`${authURL}/signUp`, {
//       name,
//       email,
//       password,
//       confirmPassword,
//     });

//     const { token } = data;

//     if (token) {
//       return { success: true, ...data };
//     }

//     return data;
//   } catch (error) {
//     console.error("[Signup Failed]: ", error);
//     return error;
//   }
// };