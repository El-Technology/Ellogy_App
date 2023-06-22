import {Box, Button, Typography} from "@mui/material";
import React from "react";
import {ReactComponent as MessageNotif} from "../../../assets/icons/message-notif.svg";

export const ResetEmailConfirmation = () => {
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
      <MessageNotif/>

      <Typography variant="h3" sx={{fontSize: "24px", fontWeight: "700", marginTop: "32px"}}>Check your inbox</Typography>

      <Typography sx={{color: "#9FA6B3", marginTop: "8px", textAlign: "center"}}>Insrtuctions have been sent to</Typography>
      <Typography sx={{color: "#58647B", fontWeight: "700", textAlign: "center"}}>example@email.com</Typography>


      <Typography sx={{color: "#9FA6B3", marginTop: "8px", textAlign: "center"}}> If you can’t find the mail, check spam folder.</Typography>

      <Button
        sx={{height: "44px", width: '438px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700", marginTop: "24px"}}
        type="submit"
        variant="contained"
        color="primary"
      >
        Try again
      </Button>
    </Box>
  )
}