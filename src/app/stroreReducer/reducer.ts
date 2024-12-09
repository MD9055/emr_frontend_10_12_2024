import { Action, createReducer, on } from '@ngrx/store';

export interface AppState {
  apiCallsStore: any; // Define your state shape
}

export const initialState: AppState = {
  apiCallsStore: { response: {} },
};

const _appReducer = createReducer(
  initialState,
  // Add your actions here
);

export function reducers(state: AppState | undefined, action: Action) {
  return _appReducer(state, action);
}
