import { MessageInput } from "./MessageInput/MessageInput";
import { MessageList } from "./MessageList/MessageList";
import { useTranslation } from "react-i18next";
import React, { useRef, useEffect, useMemo, FC } from "react";
import { useFormContext } from "react-hook-form";
import { IMessage } from "./Message/Message";
import styles from "./Chatbot.module.scss";
import { Box } from "@mui/material";

interface ChatbotProps {
  isTyping: boolean;
  messages: IMessage[];
  setMessageValue: (value: string) => void;
  messageValue: string;
  handleSend: (message: IMessage) => void;
}

export const Chatbot: FC<ChatbotProps> = ({
  isTyping,
  messages,
  setMessageValue,
  messageValue,
  handleSend,
}) => {
  const { setValue } = useFormContext();
  const { t } = useTranslation("inputs", {
    useSuspense: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const isMobile = useMemo(() => window.innerWidth < 500, []);

  useEffect(() => {
    !isTyping && !isMobile && inputRef.current?.focus();
  }, [isTyping, isMobile]);

  useEffect(() => {
    chatWindowRef.current!.scrollTop = chatWindowRef.current!.scrollHeight;
    setValue("messages", messages);
  }, [messages, setValue]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        className={styles.chat}
        sx={{
          flex: "0 1 92%",
          minHeight: "450px",
          backgroundColor: "#EFEFEF",
        }}
      >
        <MessageList list={messages} isTyping={isTyping} ref={chatWindowRef} />
      </Box>

      <Box
        sx={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <MessageInput
          ref={inputRef}
          placeholder={t("messagePlaceholder") || "red"} // bad translate
          onSend={handleSend}
          setValue={setMessageValue}
          value={messageValue}
          disabled={isTyping}
        />
      </Box>
    </Box>
  );
};
