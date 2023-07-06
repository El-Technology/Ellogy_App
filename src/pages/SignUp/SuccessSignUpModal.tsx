import {Box, Button, Modal, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../core/constants/routes";
import {ReactComponent as Success} from "../../assets/icons/success.svg";
import React, { FC } from "react";

type SuccessSignUpModalProps = {
  isOpen: boolean;
}

export const SuccessSignUpModal: FC<SuccessSignUpModalProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      <div>
        <Modal
          open={isOpen}
          onClose={redirectToLogin}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 574,
              bgcolor: 'background.paper',
              boxShadow: 24,
              outline: "none",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Button
              type="button"
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                minWidth: "24px",
                height: "24px",
                fontSize: "24px",
                color: "#9FA6B3"
              }}
              onClick={redirectToLogin}
            >
              <span>&times;</span>
            </Button>

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
              <Success/>

              <Typography variant="h3" sx={{fontSize: "24px", fontWeight: "700", marginTop: "32px", textAlign: "center"}}>Account successfully created</Typography>

              <Typography sx={{color: "#9FA6B3", marginTop: "8px", textAlign: "center"}}>Congratulations, your account has been <br/> successfully created</Typography>

              <Button
                sx={{height: "44px", width: '438px', borderRadius: '8px', textTransform: 'none', fontSize: "16px", fontWeight: "700", marginTop: "24px"}}
                type="submit"
                variant="contained"
                color="primary"
                onClick={redirectToLogin}
              >
                Done
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </>
  )
}