import React from 'react';
import {useForm} from 'react-hook-form';
import {
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  FormHelperText,
  Box,
} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {AuthHeader} from 'src/components/AuthHeader/AuthHeader';
import {useNavigate} from 'react-router-dom';

const schema = yup.object().shape({
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

export const SignUp = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    console.log('Form submitted');
  };

  const redirectToLogin = () => {
    navigate('/sign-in');
  };

  return (
    <>
      <AuthHeader/>

      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '164px'}}>
        <Grid container sx={{width: '574px', gap: '24px'}}>
          <Grid item sx={{width: '100%', textAlign: 'center'}}>
            <Typography variant="h3" sx={{fontSize: '34px', fontWeight: '700'}}>
              Sign Up
            </Typography>
          </Grid>

          <Grid item sx={{width: '100%'}}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container direction="column">
                <Grid item>
                  <Grid container spacing={2.4}>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.firstName}>
                        <Typography sx={{fontSize: '12px'}}>First Name</Typography>
                        <TextField
                          inputProps={{style: {padding: '10px 12px'}}}
                          placeholder="Enter your first name"
                          sx={{
                            height: '44px',
                            "& .MuiOutlinedInput-root": {
                              borderRadius: '8px',
                            },
                          }}
                          {...register('firstName')}
                        />
                        <FormHelperText
                          sx={{
                            fontSize: '12px',
                            textAlign: 'right',
                            marginRight: '12px',
                            marginTop: '0',
                          }}
                        >
                          {errors.firstName?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.organization}>
                        <Typography sx={{fontSize: '12px'}}>Organization</Typography>
                        <TextField
                          inputProps={{style: {padding: '10px 12px'}}}
                          placeholder="Enter your organization name"
                          sx={{
                            height: '44px',
                            "& .MuiOutlinedInput-root": {
                              borderRadius: '8px',
                            },
                          }}
                          {...register('organization')}
                        />
                        <FormHelperText
                          sx={{
                            fontSize: '12px',
                            textAlign: 'right',
                            marginRight: '12px',
                            marginTop: '0',
                          }}
                        >
                          {errors.organization?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item mt={(errors.lastName || errors.department) ? 0 : 2.4}>
                  <Grid container spacing={2.4}>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.lastName}>
                        <Typography sx={{fontSize: '12px'}}>Last Name</Typography>
                        <TextField
                          inputProps={{style: {padding: '10px 12px'}}}
                          placeholder="Enter your last name"
                          sx={{
                            height: '44px',
                            "& .MuiOutlinedInput-root": {
                              borderRadius: '8px',
                            },
                          }}
                          {...register('lastName')}
                        />
                        <FormHelperText
                          sx={{
                            fontSize: '12px',
                            textAlign: 'right',
                            marginRight: '12px',
                            marginTop: '0',
                          }}
                        >
                          {errors.lastName?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.department}>
                        <Typography sx={{fontSize: '12px'}}>Department</Typography>
                        <TextField
                          inputProps={{style: {padding: '10px 12px'}}}
                          placeholder="Enter your department"
                          sx={{
                            height: '44px',
                            "& .MuiOutlinedInput-root": {
                              borderRadius: '8px',
                            },
                          }}
                          {...register('department')}
                        />
                        <FormHelperText
                          sx={{
                            fontSize: '12px',
                            textAlign: 'right',
                            marginRight: '12px',
                            marginTop: '0',
                          }}
                        >
                          {errors.department?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item mt={(errors.email || errors.password) ? 0 : 2.4}>
                  <Grid container spacing={2.4}>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.email}>
                        <Typography sx={{fontSize: '12px'}}>Email</Typography>
                        <TextField
                          inputProps={{style: {padding: '10px 12px'}}}
                          placeholder="example@gmail.com"
                          sx={{
                            height: '44px',
                            "& .MuiOutlinedInput-root": {
                              borderRadius: '8px',
                            },
                          }}
                          {...register('email')}
                        />
                        <FormHelperText
                          sx={{
                            fontSize: '12px',
                            textAlign: 'right',
                            marginRight: '12px',
                            marginTop: '0',
                          }}
                        >
                          {errors.email?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.password}>
                        <Typography sx={{fontSize: '12px'}}>Password</Typography>
                        <TextField
                          inputProps={{style: {padding: '10px 12px', borderRadius: '8px'}}}
                          type="password"
                          placeholder="Minimum of 8 characters"
                          sx={{
                            height: '44px',
                            "& .MuiOutlinedInput-root": {
                              borderRadius: '8px',
                            },
                          }}
                          {...register('password')}
                        />
                        <FormHelperText
                          sx={{
                            fontSize: '12px',
                            textAlign: 'right',
                            marginRight: '12px',
                            marginTop: '0',
                          }}
                        >
                          {errors.password?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item mt={(errors.lastName || errors.confirmPassword) ? 0 : 2.4}>
                  <Grid container spacing={2.4}>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.phoneNumber}>
                        <Typography sx={{fontSize: '12px'}}>Phone Number</Typography>
                        <TextField
                          inputProps={{style: {padding: '10px 12px'}}}
                          placeholder="+000 00 000 00 00"
                          sx={{
                            height: '44px',
                            "& .MuiOutlinedInput-root": {
                              borderRadius: '8px',
                            },
                          }}
                          {...register('phoneNumber')}
                        />
                        <FormHelperText
                          sx={{
                            fontSize: '12px',
                            textAlign: 'right',
                            marginRight: '12px',
                            marginTop: '0',
                          }}
                        >
                          {errors.phoneNumber?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.confirmPassword}>
                        <Typography sx={{fontSize: '12px'}}>Confirm Password</Typography>
                        <TextField
                          inputProps={{style: {padding: '10px 12px', borderRadius: '8px'}}}
                          type="password"
                          placeholder="Minimum of 8 characters"
                          sx={{
                            height: '44px',
                            "& .MuiOutlinedInput-root": {
                              borderRadius: '8px',
                            },
                          }}
                          {...register('confirmPassword')}
                        />
                        <FormHelperText
                          sx={{
                            fontSize: '12px',
                            textAlign: 'right',
                            marginRight: '12px',
                            marginTop: '0',
                          }}
                        >
                          {errors.confirmPassword?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item mt={2.4}>
                  <FormControl error={!!errors.check}>
                    <Box sx={{display: 'flex'}}>
                      <input type="checkbox" style={{margin: "0"}} {...register('check')} />
                      <Typography sx={{fontSize: '12px', marginLeft: '8px'}}>
                        I agree to the <span style={{color: '#4786FF'}}>Terms of Service</span> and <span style={{color: '#4786FF'}}>Privacy Policy</span>
                      </Typography>
                    </Box>
                    <FormHelperText sx={{marginLeft: "0px"}}>{errors.check?.message}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                sx={{
                  marginTop: '24px',
                  width: '574px',
                  borderRadius: '8px',
                  textTransform: 'none',
                }}
                type="submit"
                variant="contained"
                color="primary"
              >
                Sign Up
              </Button>
            </form>
          </Grid>

          <Grid item sx={{display: 'flex', gap: '8px', marginTop: '8px'}}>
            <Typography>Already have an account?</Typography>
            <Typography sx={{color: '#4786FF', cursor: 'pointer'}} onClick={redirectToLogin}>Log in</Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
