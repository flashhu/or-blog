import { UpOutlined, EditOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { handleScrollTop } from '@util/scroll';
import { useUserStore } from '@hooks/useStore';
import './index.less';

function FixBar({ showTop }) {
  const userStore = useUserStore();
  const location = useLocation();

  return (
    <div className="fixbar">
      {
                userStore.user && location.pathname !== '/edit' &&
                <Link to="/edit/new">
                  <div className="fixbar-item">
                    <EditOutlined />
                  </div>
                </Link>
            }
      {
                showTop && location.pathname !== '/edit' &&
                <div className="fixbar-item" onClick={handleScrollTop}>
                  <UpOutlined />
                </div>
            }
    </div>
  );
}

FixBar.propTypes = {
  showTop: PropTypes.bool.isRequired,
};

export default FixBar;
