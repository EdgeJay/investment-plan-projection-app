/* eslint-disable react-hooks/exhaustive-deps */

import React, { FunctionComponent, Suspense, lazy, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Body from '../components/Body';
import Loader from '../components/Loader';
import { RootState } from '../reducers';
import * as actions from '../actions/projection';

const Chart = lazy(() => import('../components/Chart'));

const Projection: FunctionComponent = () => {
  const isBusy = useSelector((state: RootState) => state.projection.busy);
  const initialInvestment = useSelector((state: RootState) => state.projection.initialInvestment);
  const monthlyInvestment = useSelector((state: RootState) => state.projection.monthlyInvestment);
  const dataSet = useSelector((state: RootState) => state.projection.dataSet);

  const dispatch = useDispatch();
  const fetchProjection = useCallback(
    () =>
      dispatch(
        actions.fetchProjection({
          initialInvestment: 3000,
          monthlyInvestment: 500,
        })
      ),
    [dispatch]
  );

  useEffect(() => {
    fetchProjection();
  }, []);

  return (
    <Body>
      <Suspense fallback={<Loader waitMessage={'Loading chart...'} />}>
        <Chart dataSet={dataSet} width={800} height={600} />
      </Suspense>
    </Body>
  );
};

export default Projection;
