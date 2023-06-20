import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserReducer } from './types';

const initialState: IUserReducer = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  phoneNumber: null,
  password: null,
  organization: null,
  department: null,
  jwt: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUserSuccess: (state) => {
      return { ...state, error: null };
    },
    registerUserFailure: (state, action: PayloadAction<any>) => {
      return { ...state, error: action.payload };
    },
    loginUserSuccess: (state, action: PayloadAction<IUserReducer>) => {
      return { ...state, ...action.payload, error: null };
    },
    loginUserFailure: (state, action: PayloadAction<any>) => {
      return { ...state, error: action.payload };
    },
  },
});

export const {
  registerUserSuccess,
  registerUserFailure,
  loginUserSuccess,
  loginUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
