import React from 'react'
import PropTypes from 'prop-types'
import Menu from '@component/Menu'
import ErrorBoundary from '@component/ErrorBoundary'
import { MAIN_MENU, OWNER_MENU } from '@constant/config'
import './index.less'

function Layout({children}) {
  return (
    <div className="app">
      <ErrorBoundary>
        <Menu data={MAIN_MENU}/>
      </ErrorBoundary>
      <ErrorBoundary>
        <div className="content">
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