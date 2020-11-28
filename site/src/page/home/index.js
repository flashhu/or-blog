import { useEffect } from 'react';
import { useUserStore } from '@hooks/useStore';
import { CommitStat, ArticleList } from './component';

function Home() {
  const userStore = useUserStore()

  useEffect(()=>{
    if (window.localStorage.token && !userStore.user) {
      userStore.loginWithToken();
    }
  }, [])

  return (
    <div className="home">
      <CommitStat />
      <ArticleList />
    </div>
  )
}

export default Home;