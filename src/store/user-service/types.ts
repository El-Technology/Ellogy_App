export interface IUserReducer {
  id: string | null,
  firstName: string | null,
  lastName: string | null,
  email: string | null,
  phoneNumber: string | null,
  password: string | null,
  organization: string | null,
  department: string | null,
  jwt: string | null,
  role: any
}