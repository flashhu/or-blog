import React, { Suspense, lazy } from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import { observer } from 'mobx-react';
import Login from '@page/Login';
import GuardedRoute from '@component/GuardedRoute';
import Layout from '@component/Layout';
import { useUserStore } from '@hooks/useStore';

const Home = lazy(() => import('@page/home'));
const Archive = lazy(() => import('@page/archive'));
const Tags = lazy(() => import('@page/tags'));
const Lab = lazy(() => import('@page/lab'));
const About = lazy(() => import('@page/about'));
const Create = lazy(() => import('@page/create'));
const Data = lazy(() => import('@page/data'));
const NotFound = lazy(() => import('@page/exception'));
const Article = lazy(() => import('@page/article'));

const SuspenseWrapper = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  )
}

function App() {
  const userStore = useUserStore();
  console.log("isAutheticated: ", !!userStore.user)

  return (
    <Router>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/' render={() => (
          <Layout>
            <SuspenseWrapper>
              <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/archive' exact component={Archive} />
                <Route path='/tags' exact component={Tags} />
                <Route path='/lab' exact component={Lab} />
                <Route path='/about' exact component={About} />
                <Route path='/article/:id' exact component={Article} />
                <GuardedRoute path='/create' exact component={Create} auth={!!userStore.user} />
                <GuardedRoute path='/data' exact component={Data} auth={!!userStore.user} />
                <Route component={NotFound} />
              </Switch>
            </SuspenseWrapper>
          </Layout>
        )} />
      </Switch>
    </Router>
  );
}

export default observer(App);
