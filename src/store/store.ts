import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userReducer from "./user-service/userSlice";
import ticketReducer from "./ticket-service/ticketSlice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    userRedux: userReducer,
    ticketRedux: ticketReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
