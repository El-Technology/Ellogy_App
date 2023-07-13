import React from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, Typography} from "@mui/material";
import {ReactComponent as Success} from "../../../assets/icons/success.svg";
import {ROUTES} from "../../../core/constants/routes";

export const ResetSuccess = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate(ROUTES.LOGIN);
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
      <Success />

      <Typography variant="h3" sx={{fontSize: "24px", fontWeight: "700", marginTop: "32px", textAlign: "center"}}>New password <br/> confirmed successful</Typography>

      <Typography sx={{color: "#9FA6B3", marginTop: "8px", textAlign: "center"}}>
        You have successfully confirm your new password.
        <br/>
        Please, use your new password when logging in
      </Typography>

      <Button
        sx={{height: "44px", width: '438px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700", marginTop: "24px"}}
        variant="contained"
        color="primary"
        onClick={redirectToLogin}
      >
        Log in
      </Button>
    </Box>
  )
}