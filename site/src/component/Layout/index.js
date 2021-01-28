import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Menu from '@component/Menu';
import ErrorBoundary from '@component/ErrorBoundary';
import { MAIN_MENU } from '@constant/config';
import Progress from '@component/Progress';
import FixBar from '@component/FixBar';
import { calculateScrollDistance, handleScrollTop } from '@util/scroll';
import './index.less';

function Layout({ children }) {
  const location = useLocation();
  const [scrollWidth, setScrollWidth] = useState('0');
  const [showTop, setShowTop] = useState(false);
  const mode = location.pathname.substr(0, 5) === '/edit' ? 'edit' : '';

  useEffect(() => {
    window.addEventListener('scroll', handleScrollChange);
    return () => {
      window.removeEventListener('scroll', handleScrollChange);
    };
  }, []);

  useEffect(() => {
    if (scrollWidth > 25 && !showTop) {
      setShowTop(true);
    }
    if (scrollWidth < 25 && showTop) {
      setShowTop(false);
    }
  }, [scrollWidth, showTop]);

  useEffect(() => {
    setScrollWidth(0);
    handleScrollTop();
  }, [location]);

  const handleScrollChange = () => {
    const scrollPosition = calculateScrollDistance();
    setScrollWidth(scrollPosition);
  };

  return (
    <div className="app" mode={mode}>
      <Progress scroll={`${scrollWidth}%`} />
      <FixBar showTop={showTop} />
      {!mode &&
        <ErrorBoundary>
          <Menu data={MAIN_MENU} />
        </ErrorBoundary>
      }
      <ErrorBoundary>
        <div className="content">
          {children}
        </div>
      </ErrorBoundary>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default Layout;
