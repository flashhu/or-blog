import { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';

function useStores() {
  return useContext(MobXProviderContext);
}

export function useUserStore() {
  const { userStore } = useStores();
  return userStore;
}

export function useArticleStore() {
  const { articleStore } = useStores();
  return articleStore;
}

export default useStores;
