import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Menu from '@component/Menu'
import ErrorBoundary from '@component/ErrorBoundary'
import { MAIN_MENU, OWNER_MENU } from '@constant/config'
import Progress from '@component/Progress'
import FixBar from '@component/FixBar'
import { calculateScrollDistance } from '@util/scroll'
import './index.less'

function Layout({children}) {
  const [scrollWidth, setScrollWidth] = useState('0');
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollChange)
    return ()=>{
      window.removeEventListener('scroll', handleScrollChange)
    }
  }, [])

  useEffect(() => {
    if (scrollWidth > 25 && !showTop) {
      setShowTop(true)
    }
    if (scrollWidth < 25 && showTop) {
      setShowTop(false)
    }
  }, [scrollWidth])

  const handleScrollChange = () => {
    const scrollPosition = calculateScrollDistance()
    setScrollWidth(scrollPosition)
  }

  return (
    <div className="app">
      <Progress scroll={`${scrollWidth}%`} />
      <FixBar showTop={showTop} />
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