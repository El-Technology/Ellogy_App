import { Box, Button, Modal, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { ReactComponent as Error } from "../../assets/icons/error.svg";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "src/core/constants/routes";
import { useDispatch } from "react-redux";
import { resetTickets } from "src/store/ticket-service/ticketSlice";

type LogoutModalProps = {
  handleCloseModal: () => void;
};

export const LogoutModal: FC<LogoutModalProps> = ({ handleCloseModal }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(true);
  const dispatch = useDispatch();
  const handleClose = () => {
    handleCloseModal();
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(resetTickets());
    localStorage.clear();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 574,
            bgcolor: "background.paper",
            boxShadow: 24,
            outline: "none",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
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
              color: "#9FA6B3",
            }}
            onClick={handleClose}
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
              margin: "48px 0",
            }}
          >
            <Error />

            <Typography
              variant="h3"
              sx={{ fontSize: "24px", fontWeight: "700", marginTop: "32px" }}
            >
              Log Out
            </Typography>

            <Typography
              sx={{ color: "#9FA6B3", marginTop: "8px", textAlign: "center" }}
            >
              {" "}
              Are you sure you want to log out?
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <Button
                sx={{
                  height: "44px",
                  width: "215px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: "700",
                  marginTop: "24px",
                }}
                variant="outlined"
                color="error"
                onClick={handleLogout}
              >
                Yes, log out
              </Button>

              <Button
                sx={{
                  height: "44px",
                  width: "215px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: "700",
                  marginTop: "24px",
                }}
                variant="contained"
                color="error"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
