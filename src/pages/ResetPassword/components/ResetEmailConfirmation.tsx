import {Box, Button, Typography} from "@mui/material";
import React, {FC} from "react";
import {ReactComponent as MessageNotif} from "../../../assets/icons/message-notif.svg";
import {useSelector} from "react-redux";
import {getUser} from "../../../store/user-service/selector";
import {Oval} from "react-loader-spinner";

type ResetEmailConfirmationProps = {
  email: string;
  resetRequest: (data: any) => void;
}

export const ResetEmailConfirmation: FC<ResetEmailConfirmationProps> = ({email, resetRequest}) => {
  const userData = useSelector(getUser);

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
      <Typography sx={{color: "#58647B", fontWeight: "700", textAlign: "center"}}>{email}</Typography>


      <Typography sx={{color: "#9FA6B3", marginTop: "8px", textAlign: "center"}}> If you can’t find the mail, check spam folder.</Typography>

      {userData.loading ? (
        <Button
          sx={{height: "44px", width: '438px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700", marginTop: "24px"}}
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
          sx={{height: "44px", width: '438px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700", marginTop: "24px"}}
          variant="contained"
          color="primary"
          onClick={() => resetRequest({email})}
        >
          Try again
        </Button>
      )}
    </Box>
  )
}