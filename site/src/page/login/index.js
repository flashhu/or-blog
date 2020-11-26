import React from 'react'
import { observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useUserStore } from '@hooks/useStore'
import './index.less'

function Login() {
  const userStore = useUserStore()

  const onFinish = (values) => {
    userStore.login(values)
  };

  return (
    <div className="login">
      {userStore.user && <Redirect to="/" />}
      <div className="login-box">
        <h1 className="login-title">登 录</h1>
        <Form className="login-form" name="login" onFinish={onFinish}>
          <Form.Item 
            name="name"
            rules={[{ required: true, min: 0, max: 20, message: '请输入昵称!' }]}
          >
            <Input placeholder="昵称" prefix={<UserOutlined />} size="large" allowClear/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, min: 0, max: 20, message: '请输入密码, 长度低于20位!' }]}
          >
            <Input.Password placeholder="密码" prefix={<LockOutlined />} size="large" allowClear/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" shape="round" className="login-btn" htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
        <p className="login-tip">
          <span>测试账户：test</span>
          <span>密码：1qaSW2</span>
        </p>
      </div>
    </div>
  )

}

export default observer(Login);