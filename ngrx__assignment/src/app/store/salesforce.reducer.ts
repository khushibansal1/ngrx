import { createReducer, on } from '@ngrx/store';
import * as SalesforceActions from './salesforce.actions';

export interface SalesforceState {
  objects: string[];
  fields: string[];
  results: any[]; 
  error: any;
  selectedObject: string;
  fieldList: string[]
}

export const initialState: SalesforceState = {
  objects: [],
  fields: [],
  results: [],
  error: null,
  selectedObject: '',
  fieldList: []
};

export const salesforceReducer = createReducer(
  initialState,
  on(SalesforceActions.fetchObjectsSuccess, (state, { objects }) => ({ ...state, objects })),
  on(SalesforceActions.fetchObjectsFailure, (state, { error }) => ({ ...state, error })),
  on(SalesforceActions.fetchFieldsSuccess, (state, { fields }) => ({ ...state, fields })),
  on(SalesforceActions.fetchFieldsFailure, (state, { error }) => ({ ...state, error })),
  on(SalesforceActions.querySalesforceSuccess, (state, { results }) => ({ ...state, results })),
  on(SalesforceActions.querySalesforceFailure, (state, { error }) => ({ ...state, error }))
);
