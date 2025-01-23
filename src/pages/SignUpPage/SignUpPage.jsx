import { useState } from "react";

import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

import AuthPageContainer from '../../components/AuthPageContainer/AuthPageContainer'
import Button from '../../components/Button/Button'
import AuthInput from '../../components/AuthInput/AuthInput'
import { useAuth } from '../../contexts/AuthContext'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [checkPassword, setCheckPassword] = useState('')

  const navigate = useNavigate()

  const { register } = useAuth()

  const handleClick = async () => {
    console.log('account:', account)
    console.log('password:', password)
    console.log('name:', name)
    console.log('checkPassword:', checkPassword)
    if (!account || !password || !name || !checkPassword) {
      Swal.fire({
        title: '註冊失敗',
        text: '每個欄位皆為必填',
        icon: "error",
        timer: 2300,
        showConfirmButton: false,
      });
      return
    }

    // 這邊的register，應是AuthContext 的 defaultAuthContext 的 register
    const success = await register({
      name,
      account,
      password,
      checkPassword
    })

    if (success.status === "success") {
      Swal.fire({
        title: '註冊成功',
        text: '歡迎登入使用網站',
        icon: "success",
        timer: 2300,
        showConfirmButton: false,
      });
      navigate('/signin')
      return
    }
    Swal.fire({
      title: '註冊失敗',
      text: success.response.data.message,
      icon: "error",
      timer: 2300,
      showConfirmButton: false,
    });

    return;
  }

  return (
    <div>
      <AuthPageContainer title="註冊 Accounting">
        <AuthInput
          label="名字"
          placeholder="請輸入名字，範例: 王天兵"
          value={name}
          onChange={(nameInputValue) => setName(nameInputValue)}
        />
        <AuthInput
          label="帳號"
          placeholder="請輸入帳號，範例: example@gmail.com"
          type="email"
          value={account}
          onChange={(accountInputValue) => {
            setAccount(accountInputValue);
          }}
        />
        <AuthInput
          type="password"
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
        <AuthInput
          type="password"
          label="確認密碼"
          placeholder="請輸入確認密碼"
          value={checkPassword}
          onChange={(checkPasswordInputValue) => setCheckPassword(checkPasswordInputValue)}
        />
        <Button title="註冊" size="middle" onClick={handleClick}></Button>
        <a href="/signin">回到登入頁面</a>
      </AuthPageContainer>
    </div>
  )
}