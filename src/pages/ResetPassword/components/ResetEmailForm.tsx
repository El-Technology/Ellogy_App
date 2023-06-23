import React, {FC, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, FormControl, FormHelperText, Grid, TextField, Typography} from "@mui/material";
import {ReactComponent as Lock} from "../../../assets/icons/lock.svg";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {forgotPassword} from "../../../core/helpers/yupSchemas";
import {useDispatch, useSelector} from "react-redux";
import {forgotPasswordRequest} from "../../../store/user-service/asyncActions";
import {ROUTES} from "../../../core/constants/routes";
import {ResetEmailConfirmation} from "./ResetEmailConfirmation";
import {Oval} from "react-loader-spinner";
import {getUser} from "../../../store/user-service/selector";
import {ResetError} from "./ResetError";

export const ResetEmailForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector(getUser);

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailWrong, setIsEmailWrong] = useState(false);
  const [email, setEmail] = useState('');

  const {
    handleSubmit,
    register,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(forgotPassword),
  });

  const redirectToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const resetRequest = (data: any) => {
    const {email} = data;
    setEmail(email);

    const payload = {
      email,
      redirectUrl: "http://localhost:3000/reset-password/new",
    };

    // @ts-ignore
    dispatch(forgotPasswordRequest(payload))
      .then((res: any) => {
        if (res.type === "user/forgotPassword/rejected") {
          setIsEmailWrong(true)
        } else {
          setIsEmailSent(true)
        }
      })
  };

  const renderSumModal = () => {
    if (isEmailWrong) {
      return <ResetError email={email} setIsEmailWrong={setIsEmailWrong}/>
    }
    if (isEmailSent) {
      return <ResetEmailConfirmation email={email} resetRequest={resetRequest}/>
    }
  }

  return (
    <>
      {
        isEmailSent || isEmailWrong ? renderSumModal()
          : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "center",
                width: "438px",
                margin: "48px 0"
              }}
            >
              <Lock/>

              <Typography variant="h3" sx={{fontSize: "24px", fontWeight: "700", marginTop: "32px"}}>Forgot your password?</Typography>

              <Typography sx={{color: "#9FA6B3", marginTop: "8px", textAlign: "center"}}>Don’t worry! It happens. Please enter the address associated with your account</Typography>

              <form onSubmit={handleSubmit(resetRequest)}>
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
                  />
                  <FormHelperText
                    sx={{
                      fontSize: '12px',
                      textAlign: 'right',
                      marginRight: '12px',
                      marginTop: '0'
                    }}
                  >
                    {errors.email?.message}
                  </FormHelperText> </FormControl>

                <Grid item sx={{display: 'flex', width: "100%", justifyContent: "flex-start", gap: '8px', marginTop: '16px'}}>
                  <Typography>Remember your password?</Typography>
                  <Typography sx={{color: '#4786FF', cursor: 'pointer'}} onClick={redirectToLogin}>
                    Log in
                  </Typography>
                </Grid>

                <Grid container direction="row" sx={{width: "100%", display: "flex", marginTop: '24px', gap: "24px"}}>
                  <Button
                    sx={{height: "44px", width: '207px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700"}}
                    type="submit"
                    variant="outlined"
                    color="primary"
                    onClick={redirectToLogin}
                  >
                    Cancel
                  </Button>


                  {userData.loading ? (
                    <Button
                      sx={{height: "44px", width: '207px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700"}}
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
                      sx={{height: "44px", width: '207px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700"}}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Reset password
                    </Button>
                  )}
                </Grid>
              </form>
            </Box>
          )
      }
    </>
  )
}