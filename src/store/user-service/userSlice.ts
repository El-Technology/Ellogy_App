import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserReducer } from './types';
import {addNewUser, loginUser} from "./asyncActions";

const initialState: IUserReducer = {};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    removeSignUpError: (state) => {
      state.signUpError = null;
    },
    removeLoginError: (state) => {
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewUser.fulfilled, (state) => {
        state.loading = false;
        state.signUpError = null;
      })
      .addCase(addNewUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.signUpError = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loginError = null;
        Object.assign(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.loginError = action.payload;
      });
  }
});

export const {
  removeSignUpError,
  removeLoginError,
} = userSlice.actions;

export default userSlice.reducer;
