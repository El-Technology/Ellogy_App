import React from 'react';
import {useForm} from 'react-hook-form';
import {TextField, Button, Typography, Grid, FormControl, FormHelperText, Box} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {AuthHeader} from 'src/components/AuthHeader/AuthHeader';
import {useNavigate} from "react-router-dom";

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export const Login = () => {
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

  const redirectToSignUp = () => {
    navigate('/sign-up');
  };

  return (
    <>
      <AuthHeader/>

      <Box sx={{display: "flex", justifyContent: "center", marginTop: "164px"}}>
        <Grid container sx={{width: "374px", gap: "24px"}}>
          <Grid item sx={{width: "100%", textAlign: "center"}}>
            <Typography variant="h3" sx={{fontSize: "34px", fontWeight: "700"}}>Login</Typography>
          </Grid>

          <Grid item>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container direction="column">
                <Grid item>
                  <FormControl fullWidth error={!!errors.username}>
                    <Typography sx={{fontSize: "12px"}}>Username</Typography>
                    <TextField
                      inputProps={{style: {padding: "10px 12px"}}}
                      placeholder="example@gmail.com"
                      sx={{
                        height: '44px',
                        "& .MuiOutlinedInput-root": {
                          borderRadius: '8px',
                        },
                      }}
                      {...register('username')}
                    />
                    <FormHelperText
                      sx={{
                        fontSize: "12px",
                        textAlign: "right",
                        marginRight: "12px",
                        marginTop: "0"
                      }}>
                      {errors.username?.message}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item mt={2.4}>
                  <FormControl fullWidth error={!!errors.password}>
                    <Typography sx={{fontSize: "12px"}}>Password</Typography>
                    <TextField
                      inputProps={{style: {padding: "10px 12px", borderRadius: "8px"}}}
                      placeholder="Enter your password"
                      sx={{
                        height: '44px',
                        "& .MuiOutlinedInput-root": {
                          borderRadius: '8px',
                        },
                      }}
                      {...register('password')}
                    />
                    {errors.password ?
                      <FormHelperText
                        sx={{
                          fontSize: "12px",
                          textAlign: "right",
                          marginRight: "12px",
                          marginTop: "0"
                        }}>
                        {errors.password?.message}
                      </FormHelperText> :
                      <Typography
                        sx={{
                          fontSize: "12px",
                          textAlign: "right",
                          marginRight: "12px",
                          color: '#1A5EEC',
                          cursor: 'pointer'
                        }}>
                        Forgot password?
                      </Typography>}
                  </FormControl>
                </Grid>
              </Grid>

              <Button sx={{marginTop: "24px", width: "374px", borderRadius: "8px", textTransform: "none"}} type="submit" variant="contained" color="primary">
                Log in
              </Button>
            </form>
          </Grid>

          <Grid item sx={{display: 'flex', gap: '8px', marginTop: "8px"}}>
            <Typography>Don’t have an account yet?</Typography>
            <Typography sx={{color: '#4786FF', cursor: 'pointer'}} onClick={redirectToSignUp}>Sign up</Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
