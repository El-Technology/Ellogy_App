import React, {ChangeEvent} from 'react';
import {useForm} from 'react-hook-form';
import {TextField, Button, Typography, Grid, FormControl, FormHelperText, Box} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {AuthHeader} from 'src/components/AuthHeader/AuthHeader';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../../store/user-service/asyncActions';
import {getUser} from 'src/store/user-service/selector';
import {loginSchema} from "../../core/helpers/yupSchemas";
import {removeLoginError} from 'src/store/user-service/userSlice';
import {SignInType} from "../../core/types/base";
import {Oval} from 'react-loader-spinner';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector(getUser);

  const {
    handleSubmit,
    register,
    formState: {errors},
    clearErrors
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = (data: SignInType) => {
    // @ts-ignore
    dispatch(loginUser(data));
  };

  const redirectToSignUp = () => {
    navigate('/sign-up');
  };

  const redirectToResetPassword = () => {
    navigate('/reset-password');
  };

  const hideError = () => {
    dispatch(removeLoginError());
  };

  const renderEmailInfo = () => {
    const emailError = "User with email";

    if (userData.loginError?.startsWith(emailError)) {
      return (
        <FormHelperText
          sx={{
            fontSize: '12px',
            textAlign: 'right',
            marginRight: '12px',
            marginTop: '0',
            color: "#FB0B24"
          }}
        >
          Incorrect email
        </FormHelperText>
      )
    } else {
      return (
        <FormHelperText
          sx={{
            fontSize: '12px',
            textAlign: 'right',
            marginRight: '12px',
            marginTop: '0'
          }}
        >
          {errors.email?.message}
        </FormHelperText>
      )
    }
  }

  const renderPasswordInfo = () => {
    const passwordError = "Login with this credentials was failed";

    if (userData.loginError === passwordError) {
      return (
        <FormHelperText
          sx={{
            fontSize: '12px',
            textAlign: 'right',
            marginRight: '12px',
            marginTop: '0',
            color: "#FB0B24"
          }}
        >
          Incorrect password
        </FormHelperText>
      )
    } else if (errors.password) {
      return (
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
      )
    } else {
      return (
        <Typography
          sx={{
            fontSize: '12px',
            textAlign: 'right',
            marginRight: '12px',
            color: '#1A5EEC',
            cursor: 'pointer',
          }}
          onClick={redirectToResetPassword}
        >
          Forgot password?
        </Typography>
      )
    }
  }

  return (
    <>
      <AuthHeader/>

      <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '164px'}}>
        <Grid container sx={{width: '374px', gap: '24px'}}>
          <Grid item sx={{width: '100%', textAlign: 'center'}}>
            <Typography variant="h3" sx={{fontSize: '34px', fontWeight: '700'}}>
              Login
            </Typography>
          </Grid>

          <Grid item>
            <form onSubmit={handleSubmit(handleLogin)}>
              <Grid container direction="column">
                <Grid item>
                  <FormControl fullWidth error={!!errors.email}>
                    <Typography sx={{fontSize: '12px'}}>Email</Typography>
                    <TextField
                      inputProps={{style: {padding: '10px 12px'}}}
                      placeholder="example@gmail.com"
                      sx={{
                        height: '44px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                      {...register('email')}
                      onChange={() => {
                        hideError();
                        clearErrors('email');
                      }}
                    />
                    {renderEmailInfo()}
                  </FormControl>
                </Grid>

                <Grid item mt={2.4}>
                  <FormControl fullWidth error={!!errors.password}>
                    <Typography sx={{fontSize: '12px'}}>Password</Typography>
                    <TextField
                      inputProps={{style: {padding: '10px 12px', borderRadius: '8px'}}}
                      type="password"
                      placeholder="Enter your password"
                      sx={{
                        height: '44px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                      {...register('password')}
                      onChange={() => {
                        hideError();
                        clearErrors('password');
                      }}
                    />
                    {renderPasswordInfo()}
                  </FormControl>
                </Grid>
              </Grid>

              {userData.loading ? (
                <Button
                  sx={{marginTop: '24px', height: "44px", width: '374px', borderRadius: '8px', textTransform: 'none'}}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  <Oval
                    height={24}
                    width={24}
                    color="#fff"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#91B6FF"
                    strokeWidth={5}
                    strokeWidthSecondary={5}
                  />
                </Button>
              ) : (
                <Button
                  sx={{marginTop: '24px', height: "44px", width: '374px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700"}}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Log in
                </Button>
              )}
            </form>
          </Grid>

          <Grid item sx={{display: 'flex', gap: '8px', marginTop: '8px'}}>
            <Typography>Don’t have an account yet?</Typography>
            <Typography sx={{color: '#4786FF', cursor: 'pointer'}} onClick={redirectToSignUp}>
              Sign up
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
