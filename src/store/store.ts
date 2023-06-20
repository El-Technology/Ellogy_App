import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import userReducer from './user-service/userSlice';

const store = configureStore({
  reducer: {
    userRedux: userReducer,
  },
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
