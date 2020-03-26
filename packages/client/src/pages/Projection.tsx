/* eslint-disable react-hooks/exhaustive-deps */

import React, { FunctionComponent, Suspense, lazy, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Body from '../components/Body';
import Loader from '../components/Loader';
import InputRow from '../components/InputRow';
import { RootState } from '../reducers';
import * as actions from '../actions/projection';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  position: relative;
`;

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

  const handleSubmit = (initialInvestment: number, monthlyInvestment: number) => {
    dispatch(
      actions.fetchProjection({
        initialInvestment,
        monthlyInvestment,
      })
    );
  };

  return (
    <Body>
      <Container>
        <Suspense fallback={<Loader waitMessage={'Loading chart...'} />}>
          <>
            <InputRow
              initialInvestment={initialInvestment}
              monthlyInvestment={monthlyInvestment}
              handleSubmit={handleSubmit}
              disabled={isBusy}
            />
            <Chart dataSet={dataSet} width={800} height={600} />
          </>
        </Suspense>
      </Container>
    </Body>
  );
};

export default Projection;
