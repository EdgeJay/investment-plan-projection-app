import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { api, ProjectionRow } from '@ipp/common';
import {
  FETCHING_PROJECTION,
  FETCHED_PROJECTION,
  FetchingProjectionAction,
  FetchedProjectionAction,
} from '../types/projection';
import { RootState } from '../reducers';

const fetchingProjection = (): FetchingProjectionAction => ({ type: FETCHING_PROJECTION });

const fetchedProjection = ({
  initialInvestment,
  monthlyInvestment,
  dataSet,
}: {
  initialInvestment: number;
  monthlyInvestment: number;
  dataSet: ProjectionRow[];
}): FetchedProjectionAction => ({
  type: FETCHED_PROJECTION,
  initialInvestment,
  monthlyInvestment,
  dataSet,
});

export const fetchProjection = ({
  initialInvestment,
  monthlyInvestment,
}: {
  initialInvestment: number;
  monthlyInvestment: number;
}): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => {
  return async dispatch => {
    // inform app to go into busy state
    dispatch(fetchingProjection());

    const endpoint = `${
      !!process.env.REACT_APP_DOCKER_ENV ? '' : 'http://localhost:4000'
    }/api/projection`;

    // fetch data from /api/projection
    const dataSet = await api.fetchProjection({
      initialInvestment,
      monthlyInvestment,
      endpoint,
    });

    // Update store with fetched data
    dispatch(fetchedProjection({ initialInvestment, monthlyInvestment, dataSet }));
  };
};
