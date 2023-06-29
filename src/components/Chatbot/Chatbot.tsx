import { MessageInput } from "./MessageInput/MessageInput";
import { MessageList } from "./MessageList/MessageList";
import { useTranslation } from "react-i18next";
import { useRef, useEffect, useMemo, FC } from "react";
import { useFormContext } from "react-hook-form";
import { IMessage } from "./Message/Message";
import styles from "./Chatbot.module.scss";
import { Box, Button } from "@mui/material";
import { ReactComponent as Send } from "../../assets/icons/send.svg";

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
  const { setValue, getValues } = useFormContext();
  const { t } = useTranslation(["common", "inputs", "createTicket"]);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const isMobile = useMemo(() => window.innerWidth < 500, []);

  useEffect(() => {
    !isTyping && !isMobile && inputRef.current!.focus();
  }, [isTyping, isMobile]);

  useEffect(() => {
    chatWindowRef.current!.scrollTop = chatWindowRef.current!.scrollHeight;
    setValue("messages", messages);
  }, [messages, setValue]);

  useEffect(() => {
    const firstMessage = getValues("description");
    !messages.length &&
      firstMessage &&
      handleSend({ content: firstMessage, sender: "user" });
  }, [messages.length]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
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
          width: "525px",
          marginTop: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <MessageInput
          ref={inputRef}
          placeholder={t("messagePlaceholder", { ns: "inputs" }) || "red"}
          onSend={handleSend}
          setValue={setMessageValue}
          value={messageValue}
          disabled={isTyping}
        />
        <Button
          sx={{
            textTransform: "uppercase",
            minWidth: "44px",
            width: "44px",
            height: "44px",
            borderRadius: "8px",
            padding: "0",
            "&.Mui-disabled": {
              background: "#1976d2",
            },
          }}
          type="button"
          onClick={() => handleSend({ content: messageValue, sender: "user" })}
          disabled={isTyping || !messageValue.trim()}
          variant="contained"
          color="primary"
        >
          <Send />
        </Button>
      </Box>
    </Box>
  );
};
