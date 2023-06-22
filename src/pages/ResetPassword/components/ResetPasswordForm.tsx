import React from "react";
import {Box, Button, FormControl, FormHelperText, Grid, TextField, Typography} from "@mui/material";
import {ReactComponent as Unlock} from "../../../assets/icons/unlock.svg";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {resetPasswordSchema} from "../../../core/helpers/yupSchemas";

export const ResetPasswordForm = () => {
  const {
    handleSubmit,
    register,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const resetPassword = () => {
    console.log("reset")
  }

  return (
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
      <Unlock/>

      <Typography variant="h3" sx={{fontSize: "24px", fontWeight: "700", marginTop: "32px"}}>Create new password</Typography>

      <Typography sx={{color: "#9FA6B3", marginTop: "8px", textAlign: "center"}}>Create a new, strong password that you don’t use for other websites</Typography>

      <form onSubmit={handleSubmit(resetPassword)}>
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

        <Grid mt={errors.password ? 0 : 2.4}>
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

        <Button
          sx={{
            height: "44px",
            width: '438px',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: "16px",
            fontWeight: "700",
            marginTop: errors.password ? "20px" : "40px"
          }}
          type="submit"
          variant="contained"
          color="primary"
        >
          Reset password
        </Button>
      </form>
    </Box>
  )
}