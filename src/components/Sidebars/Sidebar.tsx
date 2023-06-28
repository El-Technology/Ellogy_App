import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { ReactComponent as Add } from "../../assets/icons/add.svg";
import { ReactComponent as MessageQuestion } from "../../assets/icons/message-question.svg";
import { ReactComponent as Search } from "../../assets/icons/search.svg";
import { useTranslation } from "react-i18next";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTicket,
  getTicketsByUserId,
} from "../../store/ticket-service/asyncActions";
import {
  getActiveTicket,
  getTickets,
  getTicketsLoader,
} from "../../store/ticket-service/selector";
import { Oval } from "react-loader-spinner";
import { format } from "date-fns";
import { setActiveTicket } from "src/store/ticket-service/ticketSlice";

export const Sidebar = () => {
  const { t } = useTranslation("navigation");
  const dispatch: any = useDispatch();
  const tickets = useSelector(getTickets);
  const loader = useSelector(getTicketsLoader);
  const activeTicket = useSelector(getActiveTicket);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    // @ts-ignore
    dispatch(getTicketsByUserId(user.id));
  }, []);

  useEffect(() => {
    if (tickets.length > 0 && !activeTicket) {
      // @ts-ignore
      dispatch(setActiveTicket(tickets[0]));
    }
  }, [tickets, activeTicket]);

  const createNewRequest = () => {
    // @ts-ignore
    dispatch(createTicket(user.id))
      .then(() => dispatch(getTicketsByUserId(user.id)))
      .then((res: any) => {
        dispatch(setActiveTicket(res.payload?.data[0]));
      });
  };

  const handleTicketClick = (ticket: any) => {
    dispatch(setActiveTicket(ticket));
  };

  return (
    <Box
      className="rtl-able"
      sx={{
        width: "650px",
        height: "calc(100vh - 82px)",
        padding: "40px 24px 45px",
        display: {
          xs: "none",
          sm: "flex",
          md: "flex",
          xl: "flex",
        },
        flexDirection: "column",
        alignItems: "end",
        justifyContent: "space-between",
        backgroundColor: "#FBFBFB",
        boxShadow: "0px 8px 24px 0px rgba(40, 103, 131, 0.08)",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {loader ? (
          <Button
            sx={{
              height: "44px",
              width: "251px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "700",
              gap: "8px",
            }}
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
              ariaLabel="oval-loading"
              secondaryColor="#91B6FF"
              strokeWidth={5}
              strokeWidthSecondary={5}
            />
          </Button>
        ) : (
          <Button
            sx={{
              height: "44px",
              width: "251px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "700",
              gap: "8px",
            }}
            variant="contained"
            color="primary"
            onClick={createNewRequest}
          >
            <Add />
            Create new request
          </Button>
        )}

        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            style: {
              height: "44px",
              borderRadius: "8px",
              background: "#F3F4F5",
            },
          }}
          sx={{
            border: "none",
            height: "44px",
            width: "251px",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: "700",
            gap: "8px",

            "& fieldset": { border: "none" },
            "& input::placeholder": { color: "#8790A0", opacity: 1 },
          }}
          placeholder="Search"
          variant="outlined"
          color="primary"
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {tickets &&
            tickets.map((item: any) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "227px",
                    height: "49px",
                    background: item === activeTicket ? "#ECF3FF" : "#fff",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                  key={item.id}
                  onClick={() => handleTicketClick(item)}
                >
                  <Typography sx={{ fontWeight: "700" }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#707A8E" }}>
                    {format(new Date(item.createdDate), "dd/MM/yyyy")}
                  </Typography>
                </Box>
              );
            })}
        </Box>
      </Box>

      <Button
        sx={{
          marginTop: "24px",
          height: "44px",
          width: "251px",
          borderRadius: "8px",
          textTransform: "none",
          fontSize: "16px",
          fontWeight: "700",
          gap: "8px",
        }}
        variant="outlined"
        color="primary"
      >
        <MessageQuestion />
        Help & Support
      </Button>
    </Box>
  );
};
