import { MessageInput } from "./MessageInput/MessageInput";
import { MessageList } from "./MessageList/MessageList";
import { useTranslation } from "react-i18next";
import { useRef, useEffect, useMemo, FC } from "react";
import { useFormContext } from "react-hook-form";
import { IMessage } from "./Message/Message";
import styles from "./Chatbot.module.scss";
import { Box, Button } from "@mui/material";
import { ReactComponent as MessageIcon } from "../../assets/icons/message.svg";

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
  }, [messages.length, getValues, handleSend]);

  return (
    <>
      <Box
        className={styles.chat}
        sx={{
          flex: "0 1 60%",
          minHeight: "150px",
        }}
      >
        <Box
          sx={{
            padding: "4px",
            border: "1px solid lightgrey",
            borderWidth: "0 1px 1px 0",
            width: "fit-content",
            borderRadius: "0 0 10px 0",
            display: "flex",
            alignItems: "center",
            columnGap: "5px",
            fontWeight: "400",
            "& > svg": {
              width: "12px",
            },
          }}
        >
          <MessageIcon />
          {t("chatbot", { ns: "createTicket" })}
        </Box>
        <MessageList list={messages} isTyping={isTyping} ref={chatWindowRef} />
      </Box>
      <div className={styles["chat-input__container"]}>
        <span className="rtl-able">{t("textbox", { ns: "createTicket" })}</span>
        <MessageInput
          ref={inputRef}
          placeholder={t("messagePlaceholder", { ns: "inputs" }) || "red"}
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
