import { makeAutoObservable } from 'mobx';

class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  user = null

  updateUserInfo(data) {
    this.user = data;
  }
}

export default new UserStore();
