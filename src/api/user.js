import axios from 'axios'
// import Swal from 'sweetalert2'

const baseUrl = 'http://localhost:3001/api';

// export const getHostelPage = async (hostelId, token) => {
//   try {
//     const res = await axios.get(`${baseUrl}/hostels/${hostelId}`, {
//       headers: {
//         Authorization: "Bearer " + token
//       }
//     });
//     return res.data
//   } catch (error) {
//     console.error('[Get a hostel failed]:', error)
//   }
// }

export const getUserPage = async (userId, token) => {
  try {
    const res = await axios.get(`${baseUrl}/users/${userId}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    return res.data
  } catch (error) {
    console.error('[Get a user failed]:', error)
  }
}

export const getUserOneGroup = async (userId, gpId, token) => {
  try {
    console.log('請求後端API')
    const res = await axios.get(`${baseUrl}/users/${userId}/groups/${gpId}`,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );
    return res.data
  } catch (error) {
    console.error('[Get a group failed]:', error)
  }
}