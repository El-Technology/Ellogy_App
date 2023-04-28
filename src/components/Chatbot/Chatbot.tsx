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

export const Chatbot = () => {
  const { setValue, getValues } = useFormContext();
  const [messages, setMessages] = useState<IMessage[]>(getValues("messages"));
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
    <div className={styles.chat}>
      <MessageList list={messages} isTyping={isTyping} ref={chatWindowRef} />
      <MessageInput
        ref={inputRef}
        placeholder={"Type message"}
        onSend={handleSend}
        disabled={isTyping}
      />
    </div>
  );
};
