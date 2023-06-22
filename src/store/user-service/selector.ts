import { RootState } from '../store';
import { IUserReducer } from './types';

export const getUser = (state: RootState): IUserReducer => state.userRedux;