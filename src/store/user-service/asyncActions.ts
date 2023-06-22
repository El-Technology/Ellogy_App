import { IUserReducer } from './types';
import instance from '../../utils/API';
import {VaultService} from "../../utils/storage";
import {createAsyncThunk} from "@reduxjs/toolkit";

const vaultService = new VaultService();

export const addNewUser = createAsyncThunk(
  'user/registerUser',
  async (userData: IUserReducer, { rejectWithValue }) => {
    try {
      await instance.post('/auth/register', userData);
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (userData: IUserReducer, { rejectWithValue }) => {
    try {
      const response = await instance.post('/auth/login', userData);
      vaultService.setItem('token', response.data.jwt);
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.data);
    }
  }
);