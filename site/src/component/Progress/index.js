import PropTypes from 'prop-types';
import { useEffect } from 'react';
import './index.less';

function Progress({ scroll }) {
  useEffect(() => {
    const dom = document.getElementsByClassName('progress_active')[0];
    if (dom) {
      dom.style.width = `${scroll}`;
    }
  }, [scroll]);

  return (
    <div className="progress_active" />
  );
}

Progress.propTypes = {
  scroll: PropTypes.string.isRequired,
};

export default Progress;
