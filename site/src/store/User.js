import { makeAutoObservable } from 'mobx'

class UserStore {
  constructor() {
    makeAutoObservable(this)
  }

  user = null

  login(params) {
    // todo
    this.user = params;
  }
}

export default new UserStore()