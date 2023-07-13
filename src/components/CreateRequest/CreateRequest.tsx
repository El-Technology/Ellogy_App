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
import { toast, ToastContainer } from "react-toastify";

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
    "We will generate a summary automatically as soon as we get some information from you. You can change the title and summary at any time.";

  useEffect(() => {
    if (activeTicket) {
      methods.reset({
        title: activeTicket.title || "",
        description: activeTicket.description || "",
        messages:
          [...activeTicket?.messages].sort(
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

  const { handleSubmit, reset, watch, register } = methods;

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
  }, [activeTicket]);

  const chat = useMemo(() => {
    return new ChatOpenAI({
      temperature: 0,
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
      setIsSummaryLoading(true);

      const history = await memory.loadMemoryVariables({});
      const response = await userStoryChain.call({
        history: history.chat_history[0].text,
      });

      // NOT consistent JSON response;
      const formattedResponse = JSON.parse(response.text)
        .filter((item: any) => item.priority === "high")
        .map((elem: any) => elem.story)
        .join("\n");

      if (activeTicket) {
        const id = activeTicket.id;
        console.log(history);
        dispatch(updateLocalTicket({ id, description: formattedResponse }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSummaryLoading(false);
      setIsSummaryUpdated(true);
    }
  };

  const handleSend = async (message: IMessage) => {
    setMessages([...messages, message]);
    setMessageValue("");
    try {
      setIsTyping(true);
      await processMessageToChatGpt(message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsTyping(false);
      dispatch(setIsTicketUpdate(true));
      setIsSummaryUpdated(false);
    }
  };

  const processMessageToChatGpt = async (message: IMessage) => {
    const response = await chain.call({
      value: message.content,
    });
    const res: IMessage = {
      content: response.text,
      sender: "chatGPT",
      sendTime: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, res]);
  };

  const handleResetForm = useCallback(() => {
    reset();
    setMessages([]);
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

  const successEditNotify = () =>
    toast.success(
      <div>
        <Typography fontWeight="700" color="#102142">
          Success
        </Typography>
        <Typography whiteSpace="nowrap" color="#404D68">
          Your changes were successfully saved.
        </Typography>
      </div>,
      {
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          borderLeft: "8px solid #01C860",
          width: "fit-content",
        },
      }
    );

  const saveTicketChanges = () => {
    successEditNotify();
    dispatch(setIsTicketUpdate(true));
    setIsSummaryUpdated(true);
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
              You don't have any requests yet
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
          }}
        >
          <ToastContainer
            style={{
              position: "absolute",
              top: "-27px",
              right: "20px",
            }}
          />

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
                  height={705}
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
                        Summary (Description in code){" "}
                      </Typography>
                      <TextField
                        multiline
                        inputProps={{
                          style: {
                            borderRadius: "8px",
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
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      dispatch(setIsTicketUpdate(true));
                      setIsSummaryUpdated(true);
                    }}
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
                        onClick={saveTicketChanges}
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
                      <Button
                        sx={{ minWidth: "24px", padding: "0" }}
                        onClick={activateEditMode}
                      >
                        <EditTicket />
                      </Button>

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
                        }}
                      >
                        Summary (Description in code)
                      </Typography>{" "}
                      <br /> <br />
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

                <Button
                  sx={{
                    height: "44px",
                    width: "251px",
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
                    width: "251px",
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
