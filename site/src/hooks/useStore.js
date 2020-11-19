import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'

function useStores() {
  return useContext(MobXProviderContext)
}

export function useUserStore() {
  const { userStore } = useStores();
  return userStore
}

export default useStores