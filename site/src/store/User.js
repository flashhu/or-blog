import { makeAutoObservable, runInAction } from 'mobx';
import { message } from 'antd';
import { get, post } from '@util/request';
import { API_USER_LOGIN, API_USER_TOKEN_LOGIN } from '@constant/urls';

class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  user = null

  async login(params) {
    const data = await post(API_USER_LOGIN, params);
    if (data) {
      window.localStorage.setItem('token', data.token);
      runInAction(() => {
        this.user = { name: params.name, role: data.role };
      });
      message.success('登录成功');
    }
  }

  async loginWithToken() {
    const data = await get(API_USER_TOKEN_LOGIN);
    if (data) {
      runInAction(() => {
        this.user = data;
      });
      message.success('登录成功');
    }
  }

  logout() {
    window.localStorage.removeItem('token');
    this.user = null;
    message.success('登出成功');
  }
}

export default new UserStore();
