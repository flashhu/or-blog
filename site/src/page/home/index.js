import React, { useEffect } from 'react';
import { useUserStore } from '@hooks/useStore'

function Home() {
  const userStore = useUserStore()

  useEffect(()=>{
    if (window.localStorage.token && !userStore.user) {
      userStore.loginWithToken();
    }
  }, [])

  return (
    <div>Page Home: {userStore.user && userStore.user.name}</div>
  )
}

export default Home;