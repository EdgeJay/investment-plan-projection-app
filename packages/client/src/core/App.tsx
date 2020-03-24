import React, { Suspense, ReactElement, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loader from '../components/Loader';
import Header from '../components/Header';

const Projection = lazy(() => import(/* webpackChunkName: "projection" */ '../pages/Projection'));

const App = (): ReactElement => {
  return (
    <div>
      <Router>
        <Header />
        <Switch>
          <Suspense fallback={<Loader />}>
            <Route path={'/projection'}>
              <Projection />
            </Route>
          </Suspense>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
