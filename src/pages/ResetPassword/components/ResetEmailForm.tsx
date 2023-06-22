import React, {FC} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, FormControl, Grid, TextField, Typography} from "@mui/material";
import { ReactComponent as Lock } from "../../../assets/icons/lock.svg";

export const ResetEmailForm = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate('/sign-in');
  };

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
      <Lock />

      <Typography variant="h3" sx={{fontSize: "24px", fontWeight: "700", marginTop: "32px"}}>Forgot your password?</Typography>

      <Typography sx={{color: "#9FA6B3", marginTop: "8px", textAlign: "center"}}>Don’t worry! It happens. Please enter the address associated with your account</Typography>

      <FormControl fullWidth sx={{marginTop: "24px"}}>
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
        />
      </FormControl>

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

        <Button
          sx={{height: "44px", width: '207px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700"}}
          type="submit"
          variant="contained"
          color="primary"
        >
          Reset password
        </Button>
      </Grid>
    </Box>
  )
}