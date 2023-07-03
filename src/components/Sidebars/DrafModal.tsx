import { Box, Button, Modal, Typography } from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import { ReactComponent as Error } from "../../assets/icons/error.svg";
import { useDispatch } from "react-redux";
import { createTicket, deleteTicket, getTicketsByUserId, updateTicket } from "src/store/ticket-service/asyncActions";
import { TicketData } from "src/store/ticket-service/types";
import { setActiveTicket } from "src/store/ticket-service/ticketSlice";

type DraftModalProps = {
  handleCloseModal: () => void;
  ticket: TicketData;
  userId: string;
  anotherTicket?: TicketData | null;
};

export const DraftModal: FC<DraftModalProps> = ({ handleCloseModal, ticket, userId, anotherTicket }) => {
  const [open, setOpen] = useState<boolean>(true);
  const dispatch: any = useDispatch();
  const handleClose = () => {
    handleCloseModal();
    setOpen(false);
  };

  const handleSave = useCallback(() => {
    // @ts-ignore
    dispatch(updateTicket(ticket)).then(() => handleClose());
    if(anotherTicket) {
      dispatch(setActiveTicket(anotherTicket));
      return;
    } else {
        // @ts-ignore
      dispatch(createTicket(userId)).then(() => dispatch(getTicketsByUserId(userId))).then((res) =>  {
        return dispatch(setActiveTicket(res?.payload?.data[0]))
      })
      return;
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },  [ticket, userId]);

  const handleDelete = useCallback(() => {
    // @ts-ignore
    dispatch(deleteTicket(ticket.id)).then(() => handleCloseModal()).then(() => dispatch(getTicketsByUserId(userId))).then(res => {
      dispatch(setActiveTicket(res.payload.data[0]));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket, userId])

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
            position: "absolute" as "absolute",
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
              Draft status
            </Typography>

            <Typography
              sx={{ color: "#9FA6B3", marginTop: "8px", textAlign: "center" }}
            >
              {" "}
              Are you sure you want to save draft ticket?
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
                onClick={handleSave}
              >
                Yes, save
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
                onClick={handleDelete}
              >
                No, delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
