import {
  ProjectionInitialState,
  ProjectionActionTypes,
  FETCHING_PROJECTION,
  FETCHED_PROJECTION,
} from '../types/projection';

interface Reducers {
  [type: string]: (
    state: ProjectionInitialState,
    action: ProjectionActionTypes
  ) => ProjectionInitialState;
}

export const initialState: ProjectionInitialState = {
  busy: false,
  dataSet: [],
  initialInvestment: 0,
  monthlyInvestment: 0,
};

const reducers: Reducers = {
  [FETCHING_PROJECTION]: projection => ({
    ...projection,
    busy: true,
  }),
  [FETCHED_PROJECTION]: (projection, { initialInvestment, monthlyInvestment, dataSet }) => ({
    ...projection,
    busy: false,
    dataSet,
    initialInvestment,
    monthlyInvestment,
  }),
};

export default (state: ProjectionInitialState = initialState, action: ProjectionActionTypes) =>
  reducers[action.type] ? reducers[action.type](state, action) : state;
