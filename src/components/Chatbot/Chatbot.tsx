import { MessageInput } from "./MessageInput/MessageInput";
import { MessageList } from "./MessageList/MessageList";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useMemo, FC } from "react";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { ConversationSummaryMemory } from "langchain/memory";
// import { LLMChain } from "langchain/chains";
// import { PromptTemplate } from "langchain/prompts";
import { useFormContext } from "react-hook-form";
import { IMessage } from "./Message/Message";
import styles from "./Chatbot.module.scss";
import { Box, Button } from "@mui/material";

interface ChatbotProps {
  isTyping: boolean;
  messages: IMessage[];
  setMessageValue: (value:string) => void;
  messageValue: string;
  handleSend: (message: IMessage) => void;
}

export const Chatbot: FC<ChatbotProps> = ({isTyping, messages, setMessageValue, messageValue, handleSend}) => {
  const { setValue, getValues } = useFormContext();
  const { t } = useTranslation(["common", "inputs", "createTicket"]);
  // const [messages, setMessages] = useState<IMessage[]>(getValues("messages"));
  // const [messageValue, setMessageValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const isMobile = useMemo(() => window.innerWidth < 500, []);

  // const chat = useMemo(() => {
  //   return new ChatOpenAI({
  //     temperature: 0,
  //     openAIApiKey: process.env.REACT_APP_OPENAI_SECRET_KEY,
  //   });
  // }, []);

  // const memory = useMemo(() => {
  //   return new ConversationSummaryMemory({
  //     memoryKey: "chat_history",
  //     llm: chat,
  //     returnMessages: true,
  //   });
  // }, [chat]);

  // const prompt = PromptTemplate.fromTemplate(`
  //   The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.
  //    Current conversation:
  //    {chat_history}
  //    Human: {value}
  //    AI:`);

  // const userStoryPrompt = PromptTemplate.fromTemplate(`
  //     Give a summary of this chat history in form only from user view "As a user I want to: "
  //     Current conversation:
  //     {history}
  //    `);

  // const chain = useMemo(() => {
  //   return new LLMChain({ llm: chat, prompt, memory });
  // }, [chat, prompt, memory]);

  // const userStoryChain = useMemo(() => {
  //   return new LLMChain({
  //     llm: chat,
  //     prompt: userStoryPrompt,
  //     memory: memory,
  //   });
  // }, [chat, userStoryPrompt, memory]);

  // useEffect(() => {
  //   const firstMessage = getValues("description");
  //   messages.length === 0 &&
  //     firstMessage &&
  //     handleSend({ content: firstMessage, sender: "user" });

  //   return () => {
  //     handleSummary();
  //   };
  // }, []);

  useEffect(() => {
    !isTyping && !isMobile && inputRef.current!.focus();
  }, [isTyping, isMobile]);

  useEffect(() => {
    chatWindowRef.current!.scrollTop = chatWindowRef.current!.scrollHeight;
    setValue("messages", messages);
  }, [messages]);

  useEffect(() => {
    const firstMessage = getValues("description");
    messages.length === 0 &&
      firstMessage &&
      handleSend({ content: firstMessage, sender: "user" });

    //  return () => {
    //    handleSummary();
    //  };
  }, [messages.length]);

  // const handleSummary = async () => {
  //   try {
  //     const history = await memory.loadMemoryVariables({});
  //     const response = await userStoryChain.call({
  //       history: history.chat_history[0].text,
  //     });
  //     console.log(response.text);
  //     setValue("summary", response.text);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleSend = async (message: IMessage) => {
  //   setMessageValue("");
  //   setMessages([...messages, message]);
  //   try {
  //     setIsTyping(true);
  //     await processMessageToChatGpt(message);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // };

  // const processMessageToChatGpt = async (message: IMessage) => {
  //   const response = await chain.call({
  //     value: message.content,
  //   });
  //   const res: IMessage = {
  //     content: response.text,
  //     sender: "chatGPT",
  //   };
  //   setMessages((prev) => [...prev, res]);
  // };

  return (
    <>
      <Box
        className={styles.chat}
        sx={{ height: { xs: "300px", sm: "450px", md: "500px", xl: "45vh" } }}
      >
        <MessageList list={messages} isTyping={isTyping} ref={chatWindowRef} />
      </Box>
      <div className={styles["chat-input__container"]}>
        <span className="rtl-able">{t("textbox", {ns: "createTicket"})}</span>
        <MessageInput
          ref={inputRef}
          placeholder={t("messagePlaceholder", {ns: "inputs"}) || 'red'}
          onSend={handleSend}
          setValue={setMessageValue}
          value={messageValue}
          disabled={isTyping}
        />
      </div>
      <Button
        sx={{
          textTransform: "uppercase",
          boxSizing: "border-box",
          width: "100%",
          backgroundColor: "#dfdfdf",
          fontWeight: "700",
          fontSize: "17px",
          color: "#000",
          "&:hover": {
            transition: "0.5s all",
            bgcolor: "#c5c2c2",
            opacity: "0.7",
          },
        }}
        type="button"
        onClick={() => handleSend({ content: messageValue, sender: "user" })}
        className={styles["chat__submit"]}
        disabled={isTyping || !messageValue.trim()}
      >
        {t("submit")}
      </Button>
    </>
  );
};
