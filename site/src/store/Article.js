import { makeAutoObservable } from 'mobx';

class ArticleStore {
  constructor() {
    makeAutoObservable(this);
  }

    qiniuToken = '';

    updateQiniuToken(token) {
      this.qiniuToken = token;
    }
}

export default new ArticleStore();
