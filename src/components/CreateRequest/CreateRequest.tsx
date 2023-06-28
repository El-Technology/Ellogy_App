import { Chatbot } from "../Chatbot/Chatbot";
import { CustomStepper } from "../CustomStepper/CustomStepper";
import { UserStories } from "../UserStories/UserStories";
import { TicketForm } from "../TicketForm/TicketForm";
import { useForm, FormProvider } from "react-hook-form";
import { IMessage } from "../Chatbot/Message/Message";
import { StepPage } from "../CustomStepper/StepPage/StepPage";
import { useMemo, useState } from "react";
import { LLMChain, PromptTemplate } from "langchain";
import { ConversationSummaryMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Backdrop, CircularProgress } from "@mui/material";

interface FormValues {
  title: string;
  description: string;
  messages: IMessage[];
  summary: string;
}

export const CreateRequest = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      messages: [],
      summary: "",
    },
  });
  const { handleSubmit, setValue, getValues, watch } = methods;
  const onSubmit = (data: FormValues) => {
    console.log("res data is ", data);
  };
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messageValue, setMessageValue] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>(getValues("messages"));
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);

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
  return (
    <>
      {isSummaryLoading && (
        <Backdrop
          sx={{
            zIndex: "2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={isSummaryLoading}
        >
          <CircularProgress
            sx={{
              position: "absolute",
              color: "#fff",
            }}
          />
        </Backdrop>
      )}
      <FormProvider {...methods}>
        <CustomStepper finalFunc={handleSubmit(onSubmit)}>
          <StepPage isDisabledNext={!watch("title") || !watch("description")}>
            <TicketForm />
          </StepPage>
          <StepPage
            onNext={handleSummary}
            isDisabledNext={isTyping}
            isDisabledBack={isTyping}
          >
            <Chatbot
              messages={messages}
              messageValue={messageValue}
              setMessageValue={setMessageValue}
              handleSend={handleSend}
              isTyping={isTyping}
            />
          </StepPage>
          <StepPage>
            <UserStories />
          </StepPage>
        </CustomStepper>
      </FormProvider>
    </>
  );
};
