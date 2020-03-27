import { ProjectionRow } from '@ipp/common';

export const FETCHING_PROJECTION = 'FETCHING_PROJECTION';
export const FETCHED_PROJECTION = 'FETCHED_PROJECTION';

export interface ProjectionInitialState {
  busy: boolean;
  initialInvestment: number;
  monthlyInvestment: number;
  dataSet: ProjectionRow[];
}

export interface FetchingProjectionAction {
  type: typeof FETCHING_PROJECTION;
}

export interface FetchedProjectionAction {
  type: typeof FETCHED_PROJECTION;
  initialInvestment: number;
  monthlyInvestment: number;
  dataSet: ProjectionRow[];
}

export type ProjectionActionTypes = FetchingProjectionAction & FetchedProjectionAction;
