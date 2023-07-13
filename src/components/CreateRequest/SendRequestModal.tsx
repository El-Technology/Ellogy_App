import { Box, Button, Modal, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Question } from "../../assets/icons/question.svg";
import { setIsTicketUpdate } from "src/store/ticket-service/ticketSlice";
import { updateTicket } from "../../store/ticket-service/asyncActions";
import { TicketType } from "../../store/ticket-service/types";
import { updateLocalTicket } from "src/store/ticket-service/ticketSlice";
import { Oval } from "react-loader-spinner";
import { getTicketUpdating } from "../../store/ticket-service/selector";

type SendRequestModalProps = {
  handleCloseModal: () => void;
  ticket?: TicketType;
  userId: string;
};

export const SendRequestModal: FC<SendRequestModalProps> = ({
  handleCloseModal,
  ticket,
}) => {
  const dispatch: any = useDispatch();
  const updating = useSelector(getTicketUpdating);
  const [open, setOpen] = useState<boolean>(true);
  const handleClose = () => {
    handleCloseModal();
    setOpen(false);
  };
  const handleCreateTicket = (ticket: TicketType) => {
    console.log(ticket);
    try {
      ticket &&
        dispatch(updateTicket({ ...ticket, status: 1 })).then(
          dispatch(updateLocalTicket({ ...ticket, status: 1 })).then(
            dispatch(setIsTicketUpdate(false))
          )
        );
    } catch (e) {
      console.log("Error appeared when trying to send ticket to server");
    }

    handleClose();
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
            <Question />

            <Typography
              variant="h3"
              sx={{ fontSize: "24px", fontWeight: "700", marginTop: "32px" }}
            >
              Send request
            </Typography>

            <Typography
              sx={{ color: "#9FA6B3", marginTop: "8px", textAlign: "center" }}
            >
              Are you sure you want to send request?
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
                color="primary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>

              {updating ? (
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
                  color="primary"
                >
                  <Oval
                    height={24}
                    width={24}
                    color="#fff"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#D32F2F"
                    strokeWidth={5}
                    strokeWidthSecondary={5}
                  />
                </Button>
              ) : (
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
                  color="primary"
                  onClick={() => handleCreateTicket(ticket!)}
                >
                  Yes, send
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
