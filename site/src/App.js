import React, { lazy, useEffect } from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { observer } from 'mobx-react';
import history from './history';
import Login from '@page/Login';
import GuardedRoute from '@component/GuardedRoute';
import Layout from '@component/Layout';
import SuspenseWrapper from '@component/SuspenseWrapper';
import { useUserStore } from '@hooks/useStore';
import { loginWithToken } from '@api/user';
import { checkResponse } from '@util/request';
import '@assets/style/global.less';

const Home = lazy(() => import('@page/home'));
const Archive = lazy(() => import('@page/archive'));
const Lab = lazy(() => import('@page/lab'));
const About = lazy(() => import('@page/about'));
const Edit = lazy(() => import('@page/edit'));
const Data = lazy(() => import('@page/data'));
const NotFound = lazy(() => import('@page/exception'));
const Article = lazy(() => import('@page/article'));
const Draft = lazy(() => import('@page/draft'));

function App() {
  const userStore = useUserStore();

  useEffect(() => {
    (async () => {
      if (window.localStorage.or_blog_token && !userStore.user) {
        const res = await loginWithToken();
        if (checkResponse(res)) {
          userStore.updateUserInfo(res.data);
        }
      }
    })();
  }, [userStore]);

  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route
          path="/"
          render={() => (
            <Layout>
              <SuspenseWrapper>
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/archive" exact component={Archive} />
                  <Route path="/lab" exact component={Lab} />
                  <Route path="/about" exact component={About} />
                  <Route path="/article/:id" exact component={Article} />
                  <GuardedRoute path="/draft" exact component={Draft} auth={!!userStore.user} />
                  <GuardedRoute path="/edit/:id" exact component={Edit} auth={!!userStore.user} />
                  <GuardedRoute path="/data" exact component={Data} auth={!!userStore.user} />
                  <Route component={NotFound} />
                </Switch>
              </SuspenseWrapper>
            </Layout>
          )}
        />
      </Switch>
    </Router>
  );
}

export default observer(App);
