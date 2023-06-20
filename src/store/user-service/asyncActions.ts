import {Dispatch} from 'redux';
import {
  registerUserSuccess,
  registerUserFailure,
  loginUserSuccess, loginUserFailure,
} from './userSlice';
import {IUserReducer} from './types';
import instance from '../../utils/API';

export const addNewUser = (userData: IUserReducer) => {
  return async (dispatch: Dispatch) => {
    try {
      await instance.post('/auth/register', userData);
      dispatch(registerUserSuccess());
    } catch (error) {
      dispatch(registerUserFailure(error));
    }
  };
};

export const loginUser = (userData: IUserReducer) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await instance.post('/Auth/login', userData);
      dispatch(loginUserSuccess(response.data));
    } catch (error) {
      dispatch(loginUserFailure(error));
    }
  };
};
