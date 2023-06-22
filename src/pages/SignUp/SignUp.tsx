import React, {ChangeEvent} from 'react';
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
import {AuthHeader} from 'src/components/AuthHeader/AuthHeader';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {addNewUser} from "../../store/user-service/asyncActions";
import {signUpSchema} from "../../core/helpers/yupSchemas";
import {getUser} from "../../store/user-service/selector";
import {removeSignUpError} from "../../store/user-service/userSlice";
import {SignUpType} from "../../core/types/base";
import {Oval} from "react-loader-spinner";

export const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector(getUser);

  const {
    handleSubmit,
    register,
    formState: {errors},
    clearErrors
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const registerUser = (data: SignUpType) => {
    // @ts-ignore
    dispatch(addNewUser(data));
  };

  const redirectToLogin = () => {
    navigate('/sign-in');
  };

  const hideError = () => {
    dispatch(removeSignUpError());
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
            <form onSubmit={handleSubmit(registerUser)}>
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
                          onChange={() => {
                            hideError();
                            clearErrors('firstName');
                          }}
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
                          onChange={() => {
                            hideError();
                            clearErrors('organization');
                          }}
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

                <Grid item mt={(errors.firstName || errors.organization) ? 0 : 2.4}>
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
                          onChange={() => {
                            hideError();
                            clearErrors('lastName');
                          }}
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
                          onChange={() => {
                            hideError();
                            clearErrors('department');
                          }}
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

                <Grid item mt={(errors.lastName || errors.department) ? 0 : 2.4}>
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
                          onChange={() => {
                            hideError();
                            clearErrors('email');
                          }}
                        />
                        {userData.signUpError ?
                          <FormHelperText
                            sx={{
                              fontSize: '12px',
                              textAlign: 'right',
                              marginRight: '12px',
                              marginTop: '0',
                              color: "#FB0B24"
                            }}
                          >
                            User with email already exist
                          </FormHelperText>
                          : <FormHelperText
                            sx={{
                              fontSize: '12px',
                              textAlign: 'right',
                              marginRight: '12px',
                              marginTop: '0',
                            }}
                          >
                            {errors.email?.message}
                          </FormHelperText>
                        }

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
                          onChange={() => {
                            hideError();
                            clearErrors('password');
                          }}
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

                <Grid item mt={(errors.email || errors.password || userData.signUpError) ? 0 : 2.4}>
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
                          onChange={() => {
                            hideError();
                            clearErrors('phoneNumber');
                          }}
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
                          onChange={() => {
                            hideError();
                            clearErrors('confirmPassword');
                          }}
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
                      <input
                        type="checkbox"
                        style={{margin: "0"}}
                        {...register('check')}
                        onChange={() => {
                          hideError();
                          clearErrors('check');
                        }}
                      />

                      <Typography sx={{fontSize: '12px', marginLeft: '8px'}}>
                        I agree to the <span style={{color: '#4786FF'}}>Terms of Service</span> and <span style={{color: '#4786FF'}}>Privacy Policy</span>
                      </Typography>
                    </Box>
                    <FormHelperText sx={{marginLeft: "0px"}}>{errors.check?.message}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {userData.loading ? (
                <Button
                  sx={{marginTop: '24px', height: "44px", width: '574px', borderRadius: '8px', textTransform: 'none'}}
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
                  sx={{marginTop: '24px', height: "44px", width: '574px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700"}}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Sign up
                </Button>
              )}
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
