import React from 'react'
import { observer } from 'mobx-react'
import { useUserStore } from '@hooks/useStore'

function Login() {
  const userStore = useUserStore()

  const handleLogin = () => {
    // todo
    userStore.login({ name: 'test' })
  }

  return (
    <div onClick={handleLogin}>
      Page Login：
      <span>{userStore.user && userStore.user.name}</span>
    </div>
  )

}

export default observer(Login);