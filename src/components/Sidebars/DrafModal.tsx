import {Box, Button, Modal, Typography} from "@mui/material";
import React, {FC, useState} from "react";
import {ReactComponent as Error} from "../../assets/icons/error.svg";
import {useSelector} from "react-redux";
import {createTicket, getTicketsByUserId, updateTicket} from "src/store/ticket-service/asyncActions";
import {TicketType} from "src/store/ticket-service/types";
import {addLocalTicket, removeLocalTicket, setActiveTicket, setIsTicketUpdate} from "src/store/ticket-service/ticketSlice";
import {useAppDispatch} from "../../store/store";
import {getActiveTicket, getIsTicketUpdate, getTickets} from "../../store/ticket-service/selector";

type DraftModalProps = {
  handleCloseModal: () => void;
  ticket: TicketType;
  userId: string;
  isCreating?: boolean;
};

export const DraftModal: FC<DraftModalProps> = ({handleCloseModal, ticket, userId, isCreating}) => {
  const [open, setOpen] = useState<boolean>(true);
  const dispatch: any = useAppDispatch();
  const tickets = useSelector(getTickets);
  const activeTicket = useSelector(getActiveTicket);
  const isTicketUpdate = useSelector(getIsTicketUpdate)

  const handleClose = () => {
    handleCloseModal();
    setOpen(false);
  };

  const handleSave = () => {
    if (activeTicket) {
      if (!activeTicket.id) {
        dispatch(createTicket({userId, ticket})).then(() => dispatch(getTicketsByUserId({userId}))).then((res: any) => {
          dispatch(setActiveTicket(res?.payload?.data[0]));
          isCreating && createNewLocalTicket();
          handleClose();
        })
      }

      if (isTicketUpdate) {
        console.log(ticket)
        dispatch(updateTicket(ticket)).then(() => {
          handleClose();
          dispatch(setIsTicketUpdate(false));
        })
      }
    }
  };

  const createNewLocalTicket = () => {
    const defaultTicket = {
      title: "New request",
      description:
        "We will generate a description automatically as soon as we get some information from you. You can change the title and description at any time.",
      createdDate: new Date().toISOString(),
      comment: null,
      messages: [],
      status: 0
    }
    dispatch(addLocalTicket(defaultTicket))
    dispatch(setActiveTicket(defaultTicket));
  }

  const handleDelete = () => {
    if (activeTicket) {
      if (!activeTicket.id) {
        dispatch(removeLocalTicket());
        handleClose();
        isCreating && createNewLocalTicket();
      }

      if (isTicketUpdate) {
        const recordsPerPage = tickets.length;

        dispatch(getTicketsByUserId({userId, recordsPerPage})).then(() => {
          handleClose();
          dispatch(setIsTicketUpdate(false));
          isCreating && createNewLocalTicket();
        })
      }
    }
  }

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
            <Error/>

            <Typography
              variant="h3"
              sx={{fontSize: "24px", fontWeight: "700", marginTop: "32px"}}
            >
              Draft status
            </Typography>

            <Typography
              sx={{color: "#9FA6B3", marginTop: "8px", textAlign: "center"}}
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
