import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import userReducer from './user-service/userSlice';
import ticketReducer from './ticket-service/ticketSlice';

const store = configureStore({
  reducer: {
    userRedux: userReducer,
    ticketRedux: ticketReducer,
  },
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
