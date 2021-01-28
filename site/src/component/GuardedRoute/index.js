import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const GuardedRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      auth === true
        ? <Component {...props} />
        : <Redirect to="/" />
    )}
  />
);

GuardedRoute.propTypes = {
  component: PropTypes.elementType.isRequired, // 受保护的组件
  auth: PropTypes.bool.isRequired, // 是否已登录
};

export default GuardedRoute;
