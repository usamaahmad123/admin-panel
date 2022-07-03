import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import logger from '../../middleware/logger';
import { rootReducer } from './RootReducer';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'registration', 'booking']
};
const pReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: pReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      thunk: true
    })
      .concat(logger)
      .concat(sagaMiddleware)
});

if (window.Cypress) {
  window.store = store;
  window.Cypress.store = store;
}
export const AppDispatch = store.dispatch;

export const persistor = persistStore(store);

export default store;
