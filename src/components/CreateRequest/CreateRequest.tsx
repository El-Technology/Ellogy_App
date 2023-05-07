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
  const { handleSubmit, reset, setValue, getValues } = methods;
  const onSubmit = (data: FormValues) => {
    console.log("res data is ", data);
    reset();
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
    The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.
     Current conversation:
     {chat_history}
     Human: {value}
     AI:`);

  const userStoryPrompt = PromptTemplate.fromTemplate(`
      Give a summary of this chat history in form only from user view "As a user I want to: "
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
      console.log("history", history);
      const response = await userStoryChain.call({
        history: history.chat_history[0].text,
      });
      console.log(response.text);
      setValue("summary", response.text);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("resolved");
      setIsSummaryLoading(false);
    }
  };

  const handleSend = async (message: IMessage) => {
    setMessageValue("");
    setMessages([...messages, message]);
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
        <Backdrop sx={{ zIndex: "2", display: "flex", alignItems: "center", justifyContent:"center" }} open={isSummaryLoading}>
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
          <StepPage>
            <TicketForm />
          </StepPage>
          <StepPage
            onBack={() => {
              reset();
            }}
            onNext={handleSummary}
            isButtonDisable={isTyping}
          >
            <Chatbot
              messages={messages}
              messageValue={messageValue}
              setMessageValue={setMessageValue}
              handleSend={handleSend}
              isTyping={isTyping}
            />
          </StepPage>
          <StepPage
            onNext={() => {
              reset();
            }}
          >
            <UserStories />
          </StepPage>
        </CustomStepper>
      </FormProvider>
    </>
  );
};
