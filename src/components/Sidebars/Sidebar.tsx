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
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import cx from "classnames";
import {
  getTicketsByUserId,
  searchTickets,
} from "../../store/ticket-service/asyncActions";
import {
  getActiveTicket,
  getIsTicketUpdate,
  getTickets,
  getTicketsLoader,
} from "../../store/ticket-service/selector";
import { Oval } from "react-loader-spinner";
import { format } from "date-fns";
import {
  addLocalTicket,
  setActiveTicket,
} from "src/store/ticket-service/ticketSlice";
import { Statuses } from "src/core/enums/common";
import styles from "./Sidebar.module.scss";
import { DraftModal } from "./DrafModal";
import { useAppDispatch } from "../../store/store";
import useDebounce from "../../core/hooks/useDebounce";

export const Sidebar = () => {
  const { t } = useTranslation("navigation");
  const dispatch: any = useAppDispatch();
  const tickets = useSelector(getTickets);
  const loader = useSelector(getTicketsLoader);
  const activeTicket = useSelector(getActiveTicket);
  const isTicketUpdate = useSelector(getIsTicketUpdate);
  const [isShowDraft, setIsShowDraft] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleCloseModal = () => {
    setIsShowDraft(false);
  };

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const recordsPerPage = tickets.length;
    if (debouncedSearchQuery.length)
      dispatch(
        searchTickets({ userId: user.id, ticketTitle: debouncedSearchQuery })
      );
  }, [debouncedSearchQuery]);

  useEffect(() => {
    dispatch(getTicketsByUserId({ userId: user.id })).then((data: any) => {
      console.log(data);
    });
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
        console.log("2");
        setIsShowDraft(true);
        setIsCreating(true);
        return;
      }
    }
    const defaultTicket = {
      title: "New request",
      description:
        "We will generate a description automatically as soon as we get some information from you. You can change the title and description at any time.",
      createdDate: new Date().toISOString(),
      comment: null,
      messages: [],
      status: 0,
    };
    dispatch(addLocalTicket(defaultTicket));
    dispatch(setActiveTicket(defaultTicket));
  };

  const handleTicketClick = (ticket: any) => {
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
    }

    const handleScroll = async () => {
      if (container && !debouncedSearchQuery.length) {
        const isAtBottom =
          container.scrollHeight - container.scrollTop ===
          container.clientHeight;
        if (isAtBottom) {
          const nextPage = currentPageRef.current + 1;
          console.log(nextPage);
          dispatch(
            getTicketsByUserId({ userId: user.id, currentPageNumber: nextPage })
          )
            .then((action: any) => {
              const newTickets = action.payload.data;
              if (newTickets.length > 0) {
                currentPageRef.current = nextPage;
              } else currentPageRef.current = 1;
            })
            .catch((error: any) => {
              console.log(error);
            });
        }
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [user.id, debouncedSearchQuery]);

  return (
    <>
      <Box
        className="rtl-able"
        sx={{
          width: "35%",
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
              tickets.map((item: any, index) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      cursor: "pointer",
                      width: "227px",
                      height: "49px",
                      background: item === activeTicket ? "#ECF3FF" : "#fff",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    key={JSON.stringify(item) + index}
                    onClick={() => handleTicketClick(item)}
                  >
                    <Box
                      sx={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ fontWeight: "700" }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: "#707A8E" }}>
                        {format(new Date(item.createdDate), "dd/MM/yyyy")}
                      </Typography>
                    </Box>
                    {item && (
                      <Box>
                        <Typography
                          className={cx(
                            styles.status,
                            styles[
                              `status_${Statuses[item.status].toLowerCase()}`
                            ]
                          )}
                        >
                          {Statuses[item.status]}
                        </Typography>
                      </Box>
                    )}
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
