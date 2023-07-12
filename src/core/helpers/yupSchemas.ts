import * as yup from "yup";

const nameValidation = /^[a-zA-Z]+$/;
const textFieldValidation = /^[A-Za-z0-9]*$/
const textFieldValidationWithSpaces = /^[a-zA-Z0-9_ ]*$/

export const loginSchema = yup.object().shape({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const signUpSchema = yup.object().shape({
  firstName: yup.string().trim().required('First Name is required').matches(nameValidation, 'Field contains invalid characters'),
  organization: yup.string().trim().required('Organization is required').matches(textFieldValidationWithSpaces, 'Invalid organization name'),
  lastName: yup.string().trim().required('Last Name is required').matches(nameValidation, 'Field contains invalid characters'),
  department: yup.string().trim().required('Department is required').matches(textFieldValidationWithSpaces, 'Invalid department name'),
  email: yup.string().trim().required('Email is required').email('Invalid email address'),
  password: yup.string().trim()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(textFieldValidation, 'Password contains invalid characters'),
  phoneNumber: yup.string().trim().required('Phone Number is required'),
  confirmPassword: yup
    .string().trim()
    .required('Confirm Password is required')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value || value === undefined;
    }),
  check: yup.bool().oneOf([true], 'You must agree to the Terms of Service and Privacy Policy'),
});

export const forgotPassword = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email address')
});

export const resetPasswordSchema = yup.object().shape({
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value || value === undefined;
    }),
});