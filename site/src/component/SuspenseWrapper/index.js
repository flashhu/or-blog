import { Suspense } from 'react';
import PropTypes from 'prop-types';

const SuspenseWrapper = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
};

SuspenseWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default SuspenseWrapper;
