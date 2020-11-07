import React, { Suspense, lazy, useState } from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import Menu from 'component/Menu';
import GuardedRoute from 'component/GuardedRoute';
import ErrorBoundary from 'component/ErrorBoundary';
import { MAIN_MENU, OWNER_MENU } from 'constant/config';

// 首页
const Home = lazy(() => import('page/home'));
// 归档
const Archive = lazy(() => import('page/archive'));
// 标签
const Tags = lazy(() => import('page/tags'));
// 实验室
const Lab = lazy(() => import('page/lab'));
// 关于
const About = lazy(() => import('page/about'));
// 创作中心
const Create = lazy(() => import('page/create'));
// 数据中心
const Data = lazy(() => import('page/data'));
// 404
const NotFound = lazy(() => import('page/exception'));
// 登录
const Login = lazy(() => import('page/login'));
// 文章详情
const Article = lazy(() => import('page/article'));

const SuspenseWrapper = ({children}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  )
}

function App() {
  // 是否展开nav栏
  const [showNav, setShowNav] = useState(false); 
  // 是否已登录
  const isAutheticated = false;

  const handleOpenMenu = () => {
    setShowNav(true);
  }

  const handleCloseMenu = () => {
    setShowNav(false);
  }

  return (
    <div className="app">
      <Router>
        <ErrorBoundary>
          <Menu 
            data={MAIN_MENU}
            showNav={showNav}
            handleOpenMenu={handleOpenMenu}
            handleCloseMenu={handleCloseMenu}
          />
        </ErrorBoundary>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/' render={() => (
            <div className={showNav ? "app-page short" : "app-page"}>
              <SuspenseWrapper>
                <ErrorBoundary>
                  <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/archive' exact component={Archive} />
                    <Route path='/tags' exact component={Tags} />
                    <Route path='/lab' exact component={Lab} />
                    <Route path='/about' exact component={About} />
                    <Route path='/article/:id' exact component={Article} />
                    <GuardedRoute path='/create' exact component={Create} auth={isAutheticated}/>
                    <GuardedRoute path='/data' exact component={Data} auth={isAutheticated} />
                    <Route component={NotFound} />
                  </Switch>
                </ErrorBoundary>
              </SuspenseWrapper>
            </div>
          )} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
