import React, {FC} from "react";
import {Box, Button, Typography} from "@mui/material";
import {ReactComponent as Warning} from "../../../assets/icons/warning.svg";

type ResetErrorProps = {
  email: string;
  setIsEmailWrong: any;
}

export const ResetError: FC<ResetErrorProps> = ({email, setIsEmailWrong}) => {
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
      <Warning/>

      <Typography variant="h3" sx={{fontSize: "24px", fontWeight: "700", marginTop: "32px"}}>Oops</Typography>

      <Typography sx={{color: "#9FA6B3", marginTop: "8px", textAlign: "center"}}>There is no account associated with:</Typography>
      <Typography sx={{color: "#58647B", fontWeight: "700", textAlign: "center"}}>{email}</Typography>

      <Button
        sx={{height: "44px", width: '438px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700", marginTop: "24px"}}
        variant="contained"
        color="primary"
        onClick={() => setIsEmailWrong(false)}
      >
        Try again
      </Button>
    </Box>
  )
}