import { combineReducers } from 'redux';

import { reduce as ContactHistoryReducer } from './ContactHistoryState';

// Register your redux store under a unique namespace
export const namespace = 'recent-contacts';

// Combine the reducers
export default combineReducers({
  contactHistory: ContactHistoryReducer
});
