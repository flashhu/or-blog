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
    if (data && !data.error_code) {
      window.localStorage.setItem('token', data.data.token);
      runInAction(() => {
        this.user = { name: params.name, role: data.data.role };
      });
      console.log({ name: params.name, role: data.data.role });
      message.success('登录成功');
    }
  }

  async loginWithToken() {
    const data = await get(API_USER_TOKEN_LOGIN);
    if (data && !data.error_code) {
      runInAction(() => {
        this.user = data.data;
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
