import { configureStore } from '@reduxjs/toolkit';
import reducers from './reducers';

// Assuming reducers is an object with reducer functions
const rootReducer = reducers;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
