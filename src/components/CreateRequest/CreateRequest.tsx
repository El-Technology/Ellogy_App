import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm, FormProvider } from "react-hook-form";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ConversationSummaryMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";

// store
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveTicket,
  getTickets,
  getTicketUpdating,
} from "../../store/ticket-service/selector";
import { createTicket } from "../../store/ticket-service/asyncActions";
import {
  addLocalTicket,
  setActiveTicket,
  setIsTicketUpdate,
  updateLocalTicket,
} from "../../store/ticket-service/ticketSlice";
import { TicketType } from "../../store/ticket-service/types";

// components
import { Chatbot } from "../Chatbot/Chatbot";
import { DeleteRequestModal } from "./DeleteRequestModal";
import { SendRequestModal } from "./SendRequestModal";

// assets
import { ReactComponent as Trash } from "../../assets/icons/trash.svg";
import { ReactComponent as EditTicket } from "../../assets/icons/edit-ticket.svg";
import { ReactComponent as Message } from "../../assets/icons/message-text.svg";
import { ReactComponent as Add } from "../../assets/icons/add.svg";

import useTooltip from "src/core/hooks/useTooltip";
import { IMessage } from "../Chatbot/Message/Message";
import { Statuses } from "../../core/enums/common";

interface FormValues {
  title: string;
  description: string;
  messages: IMessage[];
  summary: string;
}

export const CreateRequest = () => {
  const activeTicket = useSelector(getActiveTicket);
  const updating = useSelector(getTicketUpdating);
  const tickets = useSelector(getTickets);
  const dispatch: any = useDispatch();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const methods = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      messages: [],
      summary: "",
    },
  });
  const placeholderMessage =
    "A summary of your requirements will be shown here. Please feel free to change or add any additional requirements that you feel are not captured properly.";

  useEffect(() => {
    if (activeTicket) {
      methods.reset({
        title: activeTicket.title || "",
        description: activeTicket.description || "",
        messages:
          [...activeTicket.messages].sort(
            (a, b: IMessage) =>
              new Date(a.sendTime).getTime() - new Date(b.sendTime).getTime()
          ) || [],
        summary: activeTicket.summary || "",
      });
    }
  }, [activeTicket]);

  useEffect(() => {
    if (messages.length !== 0) {
      memory.clear();
      const inputMessages = messages
        .filter((_, index) => !(index % 2))
        .map((value) => value.content);
      const outputMessages = messages
        .filter((_, index) => index % 2)
        .map((value) => value.content);

      for (let i = 0; i < messages.length / 2; i++) {
        memory.saveContext(
          { input: inputMessages[i] },
          { output: outputMessages[i] }
        );
      }
    }
  }, [activeTicket]);

  const { handleSubmit, watch, reset, register } = methods;

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messageValue, setMessageValue] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [isSummaryUpdated, setIsSummaryUpdated] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState<boolean>(false);

  const titleRef = createRef<HTMLDivElement>();
  const isTooltipVisible = useTooltip(titleRef);

  useEffect(() => {
    setEditMode(false);
    activeTicket?.messages && setMessages(activeTicket.messages);
    //  setIsTyping(false);
    //  setIsSummaryLoading(false);
  }, [activeTicket]);

  const chat = useMemo(() => {
    return new ChatOpenAI({
      temperature: 1,
      openAIApiKey: process.env.REACT_APP_OPENAI_SECRET_KEY,
    });
  }, [activeTicket, messages]);

  const memory = useMemo(() => {
    return new ConversationSummaryMemory({
      memoryKey: "chat_history",
      llm: chat,
      returnMessages: true,
    });
  }, [chat]);

  const prompt = PromptTemplate.fromTemplate(`
     Act as an IT requirements engineer. Ask the requester one question based on his request, after each question, wait for the requester to answer. 
     Current conversation:
     {chat_history}
     Human: {value}
     AI:`);

  const userStoryPrompt = PromptTemplate.fromTemplate(`
      Summarize the current conversation only in distinguished user stories each starting with "As a user, I want: ". transfer each user requirement into a separate user story. Send response only in JSON format it should always be an array of objects with story and priority fields.
      Current conversation:
      {history}
     `);

  const chain = useMemo(() => {
    return new LLMChain({ llm: chat, prompt, memory });
  }, [chat, prompt, memory]);

  const userStoryChain = useMemo(() => {
    return new LLMChain({
      llm: chat,
      prompt: userStoryPrompt,
      memory: memory,
    });
  }, [chat, userStoryPrompt, memory]);

  const handleSummary = async () => {
    try {
      const id = activeTicket?.id;
      const history = await memory.loadMemoryVariables({});
      setIsSummaryLoading(true);
      userStoryChain
        .call({
          history: history.chat_history[0].text,
        })
        .then((response) => {
          const formattedResponse = JSON.parse(response.text)
            .filter((item: any) => item.priority === "high")
            .map((elem: any) => elem.story)
            .join("\n");
          console.log(formattedResponse);

          if (id) {
            dispatch(updateLocalTicket({ id, description: formattedResponse }));
          }
          setIsSummaryLoading(false);
          setIsSummaryUpdated(true);
        });
    } catch (error) {
      console.log(error);
      setIsSummaryLoading(false);
    }
  };

  const handleSend = async (message: IMessage) => {
    if (message.content.length <= 4000) {
      setMessages([...messages, message]);
      setMessageValue("");
      setIsTyping(true);
      const currentTicket = Object.assign({}, activeTicket);
      try {
        processMessageToChatGpt(message).then((res) => {
          if (currentTicket.id !== activeTicket?.id) {
            setMessages([...messages, res]);
            dispatch(setIsTicketUpdate(true));
          } else {
            dispatch(
              updateLocalTicket({
                id: currentTicket.id,
                messages: [...currentTicket.messages, message, res],
              })
            );
          }
          setIsTyping(false);
          setIsSummaryUpdated(false);
        });
      } catch (error) {
        console.log(error);
        setIsTyping(false);
      }
    } else {
      errorNotify("Error", "Message can`t be more than 4000 characters");
    }
  };

  const processMessageToChatGpt = async (message: IMessage) => {
    return chain
      .call({
        value: message.content,
      })
      .then((response) => {
        const res: IMessage = {
          content: response.text,
          sender: "chatGPT",
          sendTime: new Date().toISOString(),
        };
        return res;
      });
  };

  const handleResetEditForm = useCallback(() => {
    reset();
    setEditMode(false);
  }, [reset]);

  const activateEditMode = () => {
    setEditMode(true);
  };

  const updateTicketInfo = (data: FormValues) => {
    const { title, description, summary } = data;

    if (activeTicket) {
      const id = activeTicket.id;
      dispatch(updateLocalTicket({ id, title, description, summary }));
    }

    saveTicketChanges();
  };

  useEffect(() => {
    if (activeTicket) {
      const updatedTicket = tickets.find(
        (ticket: TicketType) => ticket.id === activeTicket.id
      );
      if (updatedTicket) {
        dispatch(setActiveTicket(updatedTicket));
      }
    }
  }, [tickets]);

  useEffect(() => {
    if (activeTicket?.id) {
      dispatch(updateLocalTicket({ id: activeTicket.id, messages }));
    }
  }, [messages]);

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setIsSendModalOpen(false);
  };

  const createLocalTicket = async () => {
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

  const successNotify = (title: string, description: string) =>
    toast.success(
      <div>
        <Typography fontWeight="700" color="#102142">
          {title}
        </Typography>
        <Typography color="#404D68">{description}</Typography>
      </div>,
      {
        autoClose: 1500,
        position: "top-right",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          borderLeft: "8px solid #01C860",
        },
      }
    );
  const errorNotify = (title: string, description: string) => {
    toast.error(
      <div>
        <Typography fontWeight="700" color="#102142">
          {title}
        </Typography>
        <Typography color="#404D68">{description}</Typography>
      </div>,
      {
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          borderLeft: "8px solid #dc3545",
          width: "fit-content",
        },
      }
    );
  };

  const saveTicketChanges = () => {
    successNotify("Success", "Your changes were successfully saved");
    dispatch(setIsTicketUpdate(true));
    setIsSummaryUpdated(true);
  };

  const renderStatusMessages = () => {
    let message = "";
    let messageColor = "";

    if (activeTicket?.status === Statuses["In Progress"]) {
      message = "Your request is in progress";
      messageColor = "#4786FF";
    }

    if (activeTicket?.status === Statuses.Approved) {
      message = "Your request was approved";
      messageColor = "#01C860";
    }

    if (activeTicket?.status === Statuses.Returned) {
      message = "Your request was returned";
      messageColor = "#F19702";
    }

    if (activeTicket?.status === Statuses.Done) {
      message = "Your request is done";
      messageColor = "#707A8E";
    }

    return (
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: "700",
          color: messageColor,
          textAlign: "center",
        }}
      >
        {message}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        background: "#fff",
        padding: "24px",
        borderRadius: "8px",
        display: "flex",
        gap: "24px",
        boxShadow: "0px 8px 24px 0px rgba(40, 103, 131, 0.08)",
        overflow: "hidden",
      }}
    >
      {(tickets && !tickets.length) || !activeTicket ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              maxWidth: "473px",
              width: "100%",
            }}
          >
            <Message style={{ marginBottom: "24px" }} />
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              You don`t have any requests yet
            </Typography>
            <Typography sx={{ marginBottom: "48px" }}>
              Tap the button “Create new request” here or in the side bar to
              create your first request!
            </Typography>
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
              variant="outlined"
              color="primary"
              onClick={createLocalTicket}
            >
              <Add />
              Create new request
            </Button>
          </Box>
        </Box>
      ) : (
        <FormProvider {...methods}>
          {
            <>
              <Chatbot
                messages={messages}
                messageValue={messageValue}
                setMessageValue={setMessageValue}
                handleSend={handleSend}
                isTyping={isTyping}
              />
            </>
          }
        </FormProvider>
      )}

      {tickets.length ? (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            position: "relative",
            maxWidth: "470px",
          }}
        >
          {activeTicket ? (
            editMode ? (
              <form
                style={{
                  width: "100%",

                  display: "grid",
                  gridTemplateRows: "auto 1fr",
                }}
                onSubmit={handleSubmit(updateTicketInfo)}
              >
                <Grid
                  container
                  direction="column"
                  maxHeight={705}
                  gridTemplateRows="1fr auto"
                >
                  <Grid item marginBottom={"20px"}>
                    <FormControl fullWidth>
                      <Typography sx={{ fontSize: "12px" }}>Title</Typography>
                      <TextField
                        inputProps={{ style: { padding: "10px 12px" } }}
                        placeholder="Title of request"
                        sx={{
                          height: "44px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                        {...register("title")}
                        defaultValue={activeTicket?.title || ""}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <FormControl fullWidth>
                      <Typography sx={{ fontSize: "12px" }}>
                        Identified Requirements
                      </Typography>
                      <TextField
                        multiline
                        inputProps={{
                          style: {
                            maxHeight: "572px",
                            overflow: "auto",
                          },
                        }}
                        placeholder={placeholderMessage}
                        sx={{
                          minHeight: "168px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                        {...register("description")}
                        defaultValue={activeTicket?.description || ""}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "auto",
                  }}
                >
                  <Button
                    sx={{
                      marginTop: "16px",
                      height: "44px",
                      width: "133px",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                    variant="outlined"
                    color="primary"
                    onClick={handleResetEditForm}
                  >
                    Cancel
                  </Button>

                  {updating ? (
                    <Button
                      sx={{
                        marginTop: "16px",
                        height: "44px",
                        width: "133px",
                        borderRadius: "8px",
                        textTransform: "none",
                      }}
                      type="submit"
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
                    <>
                      <Button
                        sx={{
                          marginTop: "16px",
                          height: "44px",
                          width: "133px",
                          borderRadius: "8px",
                          textTransform: "none",
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          dispatch(setIsTicketUpdate(true));
                          setIsSummaryUpdated(true);
                        }}
                      >
                        Save
                      </Button>
                    </>
                  )}
                </Box>
              </form>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "#f5f5f9",
                              color: "rgba(0, 0, 0, 0.87)",
                              fontSize: "12px",
                              maxWidth: 250,
                              border: "1px solid #dadde9",
                              "& .MuiTooltip-popper": { margin: 0 },
                            },
                          },
                        }}
                        PopperProps={{
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -15],
                              },
                            },
                          ],
                        }}
                        title={isTooltipVisible ? activeTicket?.title : null}
                        placement="top"
                      >
                        <Typography
                          ref={titleRef}
                          sx={{
                            fontSize: "24px",
                            fontWeight: "700",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            maxWidth: "250px",
                          }}
                        >
                          {activeTicket?.title}
                        </Typography>
                      </Tooltip>
                    </Box>

                    <Box sx={{ display: "flex", gap: "16px" }}>
                      {activeTicket.status === Statuses.Draft && (
                        <Button
                          sx={{ minWidth: "24px", padding: "0" }}
                          onClick={activateEditMode}
                        >
                          <EditTicket />
                        </Button>
                      )}

                      <Button
                        sx={{ minWidth: "24px", padding: "0" }}
                        onClick={() => setIsDeleteModalOpen(true)}
                      >
                        <Trash />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#707A8E", fontSize: "12px" }}>
                      Created:
                      {activeTicket?.createdDate &&
                        format(
                          new Date(activeTicket.createdDate),
                          "dd/MM/yyyy"
                        )}
                    </Typography>
                    {activeTicket?.updatedDate && (
                      <Typography sx={{ color: "#707A8E", fontSize: "12px" }}>
                        Last Modified:
                        {activeTicket?.updatedDate
                          ? format(
                              new Date(activeTicket.createdDate),
                              "dd/MM/yyyy"
                            )
                          : "N/A"}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          marginBottom: "20px",
                        }}
                      >
                        Identified Requirements
                      </Typography>
                      {isSummaryLoading ? (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Oval
                            height={24}
                            width={24}
                            color="#fff"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            ariaLabel="oval-loading"
                            secondaryColor="#4786ff"
                            strokeWidth={5}
                            strokeWidthSecondary={5}
                          />
                        </Box>
                      ) : (
                        <Typography
                          sx={{
                            maxHeight: "450px",
                            wordWrap: "break-word",
                            whiteSpace: "pre-line",
                            paddingRight: "10px",
                            overflow: "auto",
                          }}
                        >
                          {activeTicket?.description || placeholderMessage}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {isDeleteModalOpen && (
                  <DeleteRequestModal
                    handleCloseModal={handleCloseModal}
                    ticketId={activeTicket?.id}
                    userId={user.id}
                  />
                )}

                {isSendModalOpen && (
                  <SendRequestModal
                    handleCloseModal={handleCloseModal}
                    ticket={activeTicket}
                    userId={user.id}
                  />
                )}

                {activeTicket.status !== Statuses.Draft ? (
                  renderStatusMessages()
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      sx={{
                        height: "44px",
                        width: "221px",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: "700",
                        gap: "8px",
                        marginTop: "auto",
                      }}
                      variant="outlined"
                      color="primary"
                      disabled={
                        isSummaryLoading || messages.length === 0 || isTyping
                      }
                      onClick={handleSummary}
                    >
                      Generate Summary
                    </Button>
                    <Button
                      sx={{
                        height: "44px",
                        width: "221px",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: "700",
                        gap: "8px",
                        marginTop: "16px",
                      }}
                      variant="contained"
                      color="primary"
                      disabled={
                        !watch("description") ||
                        isSummaryLoading ||
                        !isSummaryUpdated ||
                        isTyping
                      }
                      onClick={() => setIsSendModalOpen(true)}
                    >
                      Send request
                    </Button>
                  </Box>
                )}
              </Box>
            )
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
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
            </Box>
          )}
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};
