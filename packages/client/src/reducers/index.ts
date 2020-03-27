import { combineReducers } from 'redux';
import projection, { initialState as projectionInitialState } from './projection';

export const appInitialState = {
  projection: projectionInitialState,
};

// root reducer function
export const rootReducer = combineReducers({ projection });

export type RootState = ReturnType<typeof rootReducer>;
