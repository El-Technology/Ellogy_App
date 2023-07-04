import { Chatbot } from "../Chatbot/Chatbot";
import { useForm, FormProvider } from "react-hook-form";
import { IMessage } from "../Chatbot/Message/Message";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LLMChain, PromptTemplate } from "langchain";
import { ConversationSummaryMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveTicket,
  getTickets,
  getTicketsLoader,
  getTicketUpdating,
} from "../../store/ticket-service/selector";
import { format } from "date-fns";
import { ReactComponent as Trash } from "../../assets/icons/trash.svg";
import { ReactComponent as EditTicket } from "../../assets/icons/edit-ticket.svg";
import { Oval } from "react-loader-spinner";
import {
  createTicket,
  getTicketsByUserId,
  updateTicket,
} from "../../store/ticket-service/asyncActions";
import {
  addLocalTicket,
  setActiveTicket,
  setIsTicketUpdate,
  setTickets,
  updateLocalTicket,
} from "../../store/ticket-service/ticketSlice";
import { TicketType } from "../../store/ticket-service/types";
import { DeleteRequestModal } from "./DeleteRequestModal";
import { SendRequestModal } from "./SendRequestModal";
import { ReactComponent as Message } from "../../assets/icons/message-text.svg";
import { ReactComponent as Add } from "../../assets/icons/add.svg";

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
  const loader = useSelector(getTicketsLoader);
  const dispatch: any = useDispatch();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      messages: [],
      summary: "",
    },
  });

  useEffect(() => {
    if (activeTicket) {
      methods.reset({
        title: activeTicket.title || "",
        description: activeTicket.description || "",
        messages: [],
        summary: "",
      });
    }
  }, [activeTicket, methods.reset]);

  const { handleSubmit, reset, setValue, getValues, watch, register } = methods;

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messageValue, setMessageValue] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>(getValues("messages"));
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setEditMode(false);
  }, [activeTicket]);

  const chat = useMemo(() => {
    return new ChatOpenAI({
      temperature: 0,
      openAIApiKey: process.env.REACT_APP_OPENAI_SECRET_KEY,
    });
  }, []);

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
      Summarize the current conversation only in distinguished user stories each starting with "As a user, I want: ". transfer each user requirement into a separate user story. Send response only in JSON format with story and priority fields.
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
      const formatedResponse = JSON.parse(response.text)
        .filter((item: any) => item.priority === "high")
        .map((elem: any) => elem.story)
        .join("\n");

      console.log(response);
      setValue("summary", formatedResponse);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("resolved");
      setIsSummaryLoading(false);
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
    }
  };

  const processMessageToChatGpt = async (message: IMessage) => {
    const response = await chain.call({
      value: message.content,
    });
    const res: IMessage = {
      content: response.text,
      sender: "chatGPT",
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
    const { title, description } = data;

    if (activeTicket) {
      const id = activeTicket.id;
      dispatch(updateLocalTicket({ id, title, description }));
      dispatch(setIsTicketUpdate(true));
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

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setIsSendModalOpen(false);
  };

  //   const createLocalRequest = () => {
  //     setIsLoading(false);
  //     const defaultTicket = {
  //       title: "New request",
  //       description:
  //         "We will generate a description automatically as soon as we get some information from you. You can change the title and description at any time.",
  //       createdDate: new Date().toISOString(),
  //       comment: null,
  //       messages: [],
  //     };
  //     dispatch(addLocalTicket(defaultTicket));
  //     dispatch(setActiveTicket(defaultTicket));
  //   };

  const createLocalTicket = () => {
    const defaultTicket = {
      title: "New request",
      description:
        "We will generate a description automatically as soon as we get some information from you. You can change the title and description at any time.",
      createdDate: new Date().toISOString(),
      comment: null,
      messages: [],
    };
    dispatch(addLocalTicket(defaultTicket));
    dispatch(setActiveTicket(defaultTicket));
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#fff",
        padding: "24px",
        borderRadius: "8px",
        display: "flex",
        gap: "24px",
        boxShadow: "0px 8px 24px 0px rgba(40, 103, 131, 0.08)",
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
            <Chatbot
              messages={messages}
              messageValue={messageValue}
              setMessageValue={setMessageValue}
              handleSend={handleSend}
              isTyping={isTyping}
            />
          }
        </FormProvider>
      )}

      {activeTicket &&
        (editMode ? (
          <form onSubmit={handleSubmit(updateTicketInfo)}>
            <Grid container direction="column">
              <Grid item>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: "12px" }}>Title</Typography>
                  <TextField
                    inputProps={{ style: { padding: "10px 12px" } }}
                    placeholder="Title of request"
                    sx={{
                      width: "310px",
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

              <Grid item mt={2.4}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: "12px" }}>Description</Typography>
                  <TextField
                    multiline
                    inputProps={{
                      style: { borderRadius: "8px", height: "168px" },
                    }}
                    placeholder="Describe your request"
                    sx={{
                      width: "310px",
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
              }}
            >
              <Button
                sx={{
                  marginTop: "24px",
                  height: "44px",
                  width: "133px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
                variant="outlined"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>

              {updating ? (
                <Button
                  sx={{
                    marginTop: "24px",
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
                <Button
                  sx={{
                    marginTop: "24px",
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
                >
                  Save
                </Button>
              )}
            </Box>
          </form>
        ) : (
          <Box
            sx={{
              width: "310px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
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
                <Typography sx={{ fontSize: "24px", fontWeight: "700" }}>
                  {activeTicket?.title}
                </Typography>

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
                  Created:{" "}
                  {activeTicket?.createdDate &&
                    format(new Date(activeTicket.createdDate), "dd/MM/yyyy")}
                </Typography>
                {activeTicket?.updatedDate && (
                  <Typography sx={{ color: "#707A8E", fontSize: "12px" }}>
                    Last Modified:{" "}
                    {activeTicket?.updatedDate
                      ? format(new Date(activeTicket.createdDate), "dd/MM/yyyy")
                      : "N/A"}
                  </Typography>
                )}
              </Box>
              <Typography>
                <strong>Description:</strong> <br /> {activeTicket?.description}
              </Typography>
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
                ticketId={activeTicket?.id}
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
              }}
              variant="contained"
              color="primary"
              onClick={() => setIsSendModalOpen(true)}
            >
              Send request
            </Button>
          </Box>
        ))}
      {/*{isSummaryLoading && (*/}
      {/*  <Backdrop*/}
      {/*    sx={{*/}
      {/*      zIndex: "2",*/}
      {/*      display: "flex",*/}
      {/*      alignItems: "center",*/}
      {/*      justifyContent: "center",*/}
      {/*    }}*/}
      {/*    open={isSummaryLoading}*/}
      {/*  >*/}
      {/*    <CircularProgress*/}
      {/*      sx={{*/}
      {/*        position: "absolute",*/}
      {/*        color: "#fff",*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </Backdrop>*/}
      {/*)}*/}
      {/*<FormProvider {...methods}>*/}
      {/*  <CustomStepper finalFunc={handleSubmit(onSubmit)}>*/}
      {/*    <StepPage isDisabledNext={!watch("title") || !watch("description")}>*/}
      {/*      <TicketForm />*/}
      {/*    </StepPage>*/}
      {/*    <StepPage*/}
      {/*      // onBack={handleResetForm}*/}
      {/*      onNext={handleSummary}*/}
      {/*      isDisabledNext={isTyping}*/}
      {/*      isDisabledBack={isTyping}*/}
      {/*    >*/}
      {/*      <Chatbot*/}
      {/*        messages={messages}*/}
      {/*        messageValue={messageValue}*/}
      {/*        setMessageValue={setMessageValue}*/}
      {/*        handleSend={handleSend}*/}
      {/*        isTyping={isTyping}*/}
      {/*      />*/}
      {/*    </StepPage>*/}
      {/*    <StepPage>*/}
      {/*      <UserStories />*/}
      {/*    </StepPage>*/}
      {/*  </CustomStepper>*/}
      {/*</FormProvider>*/}
    </Box>
  );
};
