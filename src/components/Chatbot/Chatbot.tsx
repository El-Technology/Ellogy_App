import { MessageInput } from "./MessageInput/MessageInput";
import { MessageList } from "./MessageList/MessageList";
import { useState, useRef, useEffect, useMemo } from "react";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { useFormContext } from "react-hook-form";
import { IMessage } from "./Message/Message";
import styles from "./Chatbot.module.scss";
import { Box, Button } from "@mui/material";

export const Chatbot = () => {
  const { setValue, getValues } = useFormContext();
  const [messages, setMessages] = useState<IMessage[]>(getValues("messages"));
  const [messageValue, setMessageValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

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
     ChatGPT should to act as a requirements engineer and have a conversation with the requester about his demand
     Current conversation:
     {chat_history}
     {value}
     `);

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

  useEffect(() => {
    const firstMessage = getValues("description");
    messages.length === 0 &&
      firstMessage &&
      handleSend({ content: firstMessage, sender: "user" });

    return () => {
      handleSummary();
    };
  }, []);

  useEffect(() => {
    !isTyping && inputRef.current!.focus();
  }, [isTyping]);

  useEffect(() => {
    chatWindowRef.current!.scrollTop = chatWindowRef.current!.scrollHeight;
    setValue("messages", messages);
  }, [messages]);

  const handleSummary = async () => {
    try {
      const history = await memory.loadMemoryVariables({});
      const response = await userStoryChain.call({
        history: history.chat_history[0].text,
      });
      console.log(response.text);
      setValue("summary", response.text);
    } catch (error) {
      console.log(error);
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
      <Box
        className={styles.chat}
        sx={{ height: { xs: "300px", sm: "450px", md: "500px" } }}
      >
        <MessageList list={messages} isTyping={isTyping} ref={chatWindowRef} />
      </Box>
      <div className={styles["chat-input__container"]}>
        <span>Textbox</span>
        <MessageInput
          ref={inputRef}
          placeholder={"Type message"}
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
        Submit
      </Button>
    </>
  );
};
