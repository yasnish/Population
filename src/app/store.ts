import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import populationReducer from '../features/population/populationSlice';

const reducer = {
  population: populationReducer,
};
const preloadedState = {};

const isDevelopMode = process.env.NODE_ENV !== 'production';

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
    if (isDevelopMode) {
      defaultMiddleware.concat(logger);
    }
    return defaultMiddleware;
  },
  devTools: isDevelopMode,
  preloadedState,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
