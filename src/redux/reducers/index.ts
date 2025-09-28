// src/redux/rootReducer.ts
import UserReducer from './UserReducer';
import AdminAuthData from './AuthReducer';
import { combineReducers } from 'redux';

// Combine all reducers
const rootReducer = combineReducers({
  UserReducer,
  auth: AdminAuthData
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
