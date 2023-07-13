import { Box, Button, Modal, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Error } from "../../assets/icons/error.svg";
import {
  deleteTicket,
  getTicketsByUserId,
} from "../../store/ticket-service/asyncActions";
import { setActiveTicket } from "../../store/ticket-service/ticketSlice";
import { Oval } from "react-loader-spinner";
import {
  getTickets,
  getTicketUpdating,
} from "../../store/ticket-service/selector";

type DeleteRequestModalProps = {
  handleCloseModal: () => void;
  ticketId?: string;
  userId: string;
};

export const DeleteRequestModal: FC<DeleteRequestModalProps> = ({
  handleCloseModal,
  ticketId,
  userId,
}) => {
  const dispatch: any = useDispatch();
  const updating = useSelector(getTicketUpdating);
  const tickets = useSelector(getTickets);

  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => {
    handleCloseModal();
    setOpen(false);
  };

  const handleDelete = () => {
    const recordsPerPage = tickets.length;

    //@ts-ignore
    dispatch(deleteTicket(ticketId))
      .then(() => handleCloseModal())
      .then(() =>
        dispatch(getTicketsByUserId({ userId: userId, recordsPerPage }))
      )
      .then((res: any) => {
        dispatch(setActiveTicket(res.payload.data[0]));
      });
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
            position: "absolute",
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
              Delete request
            </Typography>

            <Typography
              sx={{ color: "#9FA6B3", marginTop: "8px", textAlign: "center" }}
            >
              You will no longer be able to access this request. Are you sure
              you want to do this?
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
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
                  color="error"
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
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                >
                  Yes, delete
                </Button>
              )}

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
