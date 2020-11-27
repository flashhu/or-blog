import { useEffect } from 'react';
import { useUserStore } from '@hooks/useStore';
import { CommitState } from './component';

function Home() {
  const userStore = useUserStore()

  useEffect(()=>{
    if (window.localStorage.token && !userStore.user) {
      userStore.loginWithToken();
    }
  }, [])

  return (
    <div className="home">
      <CommitState />
    </div>
  )
}

export default Home;