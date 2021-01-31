import { observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useUserStore } from '@hooks/useStore';
import { login } from '@api/user';
import { checkResponse } from '@util/request';
import './index.less';

function Login() {
  const userStore = useUserStore();
  // const history = useHistory();

  const onFinish = async (values) => {
    const res = await login(values);
    if (checkResponse(res)) {
      window.localStorage.setItem('token', res.data.token);
      userStore.updateUserInfo({ name: values.name, role: res.data.role });
      message.success('登录成功');
      // history.goBack();
    }
  };

  return (
    <div className="login">
      { userStore.user && <Redirect to="/" /> }
      <div className="login-box">
        <Link to="/">
          <h1 className="login-title">一 本 笔 记</h1>
        </Link>
        <Form className="login-form" name="login" onFinish={onFinish}>
          <Form.Item
            name="name"
            rules={[{ required: true, min: 0, max: 20, message: '请输入昵称!' }]}
          >
            <Input placeholder="昵称" prefix={<UserOutlined />} allowClear />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, min: 0, max: 20, message: '请输入密码, 长度低于20位!' }]}
          >
            <Input.Password placeholder="密码" prefix={<LockOutlined />} allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" shape="round" className="login-btn" htmlType="submit">登 录</Button>
          </Form.Item>
        </Form>
        <p className="login-tip">
          <span>账户：test</span>
          <span>密码：1qaSW2</span>
        </p>
      </div>
    </div>
  );
}

export default observer(Login);
