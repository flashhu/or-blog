import { observer } from 'mobx-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect } from 'react-router-dom';
import { message } from 'antd';
import { useUserStore } from '@hooks/useStore';
import logo from '@assets/book.svg';
import './index.less';

function Menu({ data }) {
  const [isRedirect, setIsRedirect] = useState(false);
  const userStore = useUserStore();

  const handleClickLogo = () => {
    if (userStore.user) {
      // 登出
      window.localStorage.removeItem('token');
      userStore.updateUserInfo(null);
      message.success('登出成功');
    } else {
      // 登录
      setIsRedirect(true);
    }
  };
  console.log(isRedirect);
  return (
    <header className="header-wrapper">
      {isRedirect && <Redirect to="/login" />}
      <div className="header-content">
        <div className="logo-wrapper">
          <img className="logo" src={logo} onClick={handleClickLogo} />
          {userStore.user && <span className="logo-name">{userStore.user.name}</span>}
        </div>
        <nav className="menu">
          {data.map((item) =>
            (<span className="menu-item" key={item.path}>
              <NavLink to={item.path} className="hvr-underline">{item.name}</NavLink>
            </span>))}
        </nav>
      </div>
    </header>
  );
}

Menu.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

export default observer(Menu);
