import React, { Suspense, FunctionComponent, lazy } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createAppStore } from './store';
import { appInitialState } from '../reducers';
import Loader from '../components/Loader';
import Header from '../components/Header';

const Projection = lazy(() => import(/* webpackChunkName: "projection" */ '../pages/Projection'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ '../pages/Home'));

const store = createAppStore(appInitialState);

const App: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <div>
        <Router>
          <Header />
          <Switch>
            <Suspense fallback={<Loader />}>
              <Route path={'/projection'}>
                <Projection />
              </Route>
              <Route path={'/'}>
                <Home />
              </Route>
            </Suspense>
          </Switch>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
