import {AuthHeader} from "../../components/AuthHeader/AuthHeader";
import {Box, Button, Modal} from "@mui/material";
import {ResetEmailForm} from "./components/ResetEmailForm";
import {ResetEmailConfirmation} from "./components/ResetEmailConfirmation";
import {ResetError} from "./components/ResetError";
import {ResetSuccess} from "./components/ResetSuccess";
import {ResetPasswordForm} from "./components/ResetPasswordForm";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../core/constants/routes";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      <AuthHeader/>

      <div>
        <Modal
          open={true}
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

            <ResetEmailForm />
            {/*<ResetEmailConfirmation />*/}
            {/*<ResetError />*/}
            {/*<ResetPasswordForm />*/}
            {/*<ResetSuccess />*/}
          </Box>
        </Modal>
      </div>
    </>
  )
}