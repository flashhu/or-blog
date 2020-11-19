import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Menu from '@component/Menu'
import ErrorBoundary from '@component/ErrorBoundary'
import { MAIN_MENU, OWNER_MENU } from '@constant/config'
import './index.less'

function Layout({children}) {
  // 是否展开nav栏
  const [showNav, setShowNav] = useState(false);

  const handleOpenMenu = () => {
    setShowNav(true);
  }

  const handleCloseMenu = () => {
    setShowNav(false);
  }

  return (
    <div className="app">
      <ErrorBoundary>
        <Menu
          data={MAIN_MENU}
          showNav={showNav}
          handleOpenMenu={handleOpenMenu}
          handleCloseMenu={handleCloseMenu}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <div className={showNav ? "app-page short" : "app-page"}>
          {children}
        </div>
      </ErrorBoundary>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
}

export default Layout