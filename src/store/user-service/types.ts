export interface IUserReducer {
  loading?: boolean,
  id?: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  phoneNumber?: string
  organization?: string,
  department?: string,
  jwt?: string,
  role?: number;
  loginError?: string | null;
  signUpError?: string | null;
}