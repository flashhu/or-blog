import { Suspense } from 'react';
import PropTypes from 'prop-types';
import './index.less';

const SuspenseWrapper = ({ children }) => {
  return (
    <Suspense fallback={<div className="suspense-tip">疯狂加载中...</div>}>
      {children}
    </Suspense>
  );
};

SuspenseWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default SuspenseWrapper;
