import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const signUpSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  organization: yup.string().required('Organization is required'),
  lastName: yup.string().required('Last Name is required'),
  department: yup.string().required('Department is required'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  password: yup.string().required('Password is required'),
  phoneNumber: yup.string().required('Phone Number is required'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value || value === undefined;
    }),
  check: yup.bool().oneOf([true], 'You must agree to the Terms of Service and Privacy Policy'),
});