import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
// import { useEffect } from "react";
import * as jwt from "jsonwebtoken"
import { useNavigate } from "react-router-dom";

// api
import { login } from "../api/auth"
// import { register } from "../api/auth"
// import { getUserInfo, getLandlordInfo, switchRole } from "../api/setting"
// import { postApplyLandlord } from "../api/user";
import Swal from 'sweetalert2'

// 定義 context 內容
const defaultAuthContext = {
  isAuthenticated: false,
  currentMember: null,
  register: null,
  login: null,
  logout: null
};

const AuthContext = createContext(defaultAuthContext)
export const useAuth = () => useContext(AuthContext)
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [payload, setPayload] = useState(null)
  const navigate = useNavigate();

  // 儲存TOKEN不讓頁面在重新整理時讀不到
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tempPayload = jwt.decode(token)
      setIsAuthenticated(true)
      setPayload(tempPayload)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          currentRole: payload.currentRole,
          landlordId: payload.Landlord ? payload.Landlord.id : null
        },
        // register: async (data) => {
        //   // 呼叫register function(向後端請求註冊的api)
        //   const success = await register({
        //     name: data.name,
        //     email: data.email,
        //     password: data.password,
        //     confirmPassword: data.confirmPassword,
        //   });
        //   return success;
        // },
        login: async (userInputData) => {
          const loginResult = await login({
            account: userInputData.account,
            password: userInputData.password
          })
          const { token } = loginResult.data
          console.log('token:', token)
          const tempPayload = jwt.decode(token) //取得的token用jwt解析
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem("token", token);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          console.log('tempPayload:', tempPayload)
          // ====================================================
          // 呼叫login function(向後端請求登入的api)抽取到這邊。hostel專案的原本寫法。
          // const { success, token, user } = await login({
          //   email: data.email,
          //   password: data.password
          // })
          // const tempPayload = jwt.decode(token) //取得的token用jwt解析
          // if (tempPayload) {
          //   setPayload(tempPayload);
          //   setIsAuthenticated(true);
          //   localStorage.setItem("token", token);
          //   // localStorage.setItem("role", user.role);
          //   // localStorage.setItem("currentRole", user.currentRole);
          // } else {
          //   setPayload(null);
          //   setIsAuthenticated(false);
          // }
          return loginResult;
        },
        logout: () => {
          localStorage.removeItem("token");
          setPayload(null);
          setIsAuthenticated(false);
          navigate("/signin");
          Swal.fire({
            title: "登出成功",
            timer: 2000,
            icon: "success",
            showConfirmButton: false
          })
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}