import React, { useEffect, useRef, useState } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";

// store
import {
  getTicketsByUserId,
  searchTickets,
} from "../../store/ticket-service/asyncActions";
import {
  getActiveTicket,
  getIsTicketUpdate,
  getTickets,
  getTicketsLoader,
  getTicketsLoadingMore,
} from "../../store/ticket-service/selector";
import { TicketType } from "src/store/ticket-service/types";
import { createTicket } from "../../store/ticket-service/asyncActions";
import {
  addLocalTicket,
  setActiveTicket,
} from "../../store/ticket-service/ticketSlice";
import { useAppDispatch } from "../../store/store";

// components
import { DraftModal } from "./DrafModal";
import { SidebarTicket } from "./SidebarTicket";

// assets
import { ReactComponent as Add } from "../../assets/icons/add.svg";
import { ReactComponent as MessageQuestion } from "../../assets/icons/message-question.svg";
import { ReactComponent as Search } from "../../assets/icons/search.svg";

// styles
import useDebounce from "../../core/hooks/useDebounce";

export const Sidebar = () => {
  //   const { t } = useTranslation("navigation");
  const dispatch = useAppDispatch();
  const tickets = useSelector(getTickets);
  const loader = useSelector(getTicketsLoader);
  const activeTicket = useSelector(getActiveTicket);
  const isTicketUpdate = useSelector(getIsTicketUpdate);
  const loadingMore = useSelector(getTicketsLoadingMore);

  const [isShowDraft, setIsShowDraft] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTicketsEnds, setIsTicketsEnds] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleCloseModal = () => {
    setIsShowDraft(false);
  };

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    setIsTicketsEnds(false);

    if (debouncedSearchQuery.length)
      dispatch(
        searchTickets({ userId: user.id, ticketTitle: debouncedSearchQuery })
      );
    currentPageRef.current = 1;
    const container = containerRef.current;
    if (container) {
      container.scrollTop = 0;
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    dispatch(getTicketsByUserId({ userId: user.id }));
  }, []);

  useEffect(() => {
    if (tickets.length > 0 && !activeTicket) {
      dispatch(setActiveTicket(tickets[0]));
    }
  }, [tickets, activeTicket]);

  const createLocalTicket = () => {
    if (activeTicket) {
      if (!activeTicket.id) {
        setIsShowDraft(true);
        setIsCreating(true);
        return;
      }

      if (isTicketUpdate) {
        setIsShowDraft(true);
        setIsCreating(true);
        return;
      }
    }
    const defaultTicket: Partial<TicketType> = {
      title: "New request",
      description: "",
      createdDate: new Date().toISOString(),
      comment: "",
      messages: [],
      status: 0,
    };
    dispatch(createTicket({ userId: user.id, ticket: defaultTicket })).then(
      (data: any) => {
        dispatch(addLocalTicket(data.payload));
        dispatch(setActiveTicket(data.payload));
      }
    );
  };

  const handleTicketClick = (ticket: TicketType) => {
    if (isTicketUpdate) {
      setIsShowDraft(true);
      setIsCreating(false);
    } else dispatch(setActiveTicket(ticket));
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef<number>(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!debouncedSearchQuery.length) {
      dispatch(getTicketsByUserId({ userId: user.id }));
      currentPageRef.current = 1;
      if (container) {
        container.scrollTop = 0;
      }
    }

    const handleScroll = async () => {
      if (container) {
        const isAtBottom =
          Math.floor(container.scrollHeight - container.scrollTop) ===
          container.clientHeight;
        if (isAtBottom) {
          if (!debouncedSearchQuery.length) {
            const nextPage = currentPageRef.current + 1;
            dispatch(
              getTicketsByUserId({
                userId: user.id,
                currentPageNumber: nextPage,
              })
            )
              .then((action: any) => {
                const newTickets = action.payload.data;
                if (newTickets.length > 0) {
                  currentPageRef.current = nextPage;
                } else setIsTicketsEnds(true);
              })
              .catch((error: any) => {
                console.log(error);
              });
          }

          if (debouncedSearchQuery.length) {
            const nextPage = currentPageRef.current + 1;
            dispatch(
              searchTickets({
                userId: user.id,
                ticketTitle: debouncedSearchQuery,
                currentPageNumber: nextPage,
              })
            )
              .then((action: any) => {
                const newTickets = action.payload.data;
                if (newTickets.length > 0) {
                  currentPageRef.current = nextPage;
                } else setIsTicketsEnds(true);
              })
              .catch((error: any) => {
                console.log(error);
              });
          }
        }
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [debouncedSearchQuery]);

  return (
    <>
      <Box
        className="rtl-able"
        sx={{
          height: "calc(100vh - 82px)",
          padding: "40px 24px 45px 0",
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
          boxSizing: "border-box",
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxHeight: "80%",
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
              onClick={createLocalTicket}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Box
            ref={containerRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              overflowY: "auto",
            }}
          >
            {tickets &&
              tickets.map((ticket: TicketType, index) => (
                <SidebarTicket
                  key={JSON.stringify(ticket) + index}
                  ticket={ticket}
                  handleTicketClick={handleTicketClick}
                  activeTicket={activeTicket}
                />
              ))}
          </Box>
        </Box>

        {loadingMore && !isTicketsEnds && (
          <Oval
            height={24}
            width={24}
            color="#fff"
            wrapperStyle={{
              alignSelf: "center",
            }}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#91B6FF"
            strokeWidth={5}
            strokeWidthSecondary={5}
          />
        )}

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
      {isShowDraft && activeTicket && (
        <DraftModal
          handleCloseModal={handleCloseModal}
          ticket={activeTicket}
          userId={user.id}
          isCreating={isCreating}
        />
      )}
    </>
  );
};
