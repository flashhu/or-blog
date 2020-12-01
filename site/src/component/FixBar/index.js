import { UpOutlined, EditOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { handleScrollTop } from '@util/scroll'
import { useUserStore } from '@hooks/useStore';
import './index.less'

function FixBar({showTop}) {
    const userStore = useUserStore();

    return (
        <div className="fixbar">
            {userStore.user && <Link to='/create'><div className="fixbar-item"><EditOutlined /></div></Link>}
            {showTop && <div className="fixbar-item" onClick={handleScrollTop}><UpOutlined /></div>}
        </div>
    )
}

FixBar.propTypes = {
    showTop: PropTypes.bool.isRequired,
};

export default FixBar;