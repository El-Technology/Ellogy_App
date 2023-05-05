import { forwardRef } from "react";
import styles from "./MessageList.module.scss";
import { Message } from "../Message/Message";
import { IMessage } from "../Message/Message";
import { useTranslation } from "react-i18next";
interface IMessagesListProps {
  list: Array<IMessage>;
  isTyping: boolean;
}
export const MessageList = forwardRef<HTMLDivElement, IMessagesListProps>(
  ({ list, isTyping }, ref) => {
    const { t } = useTranslation('createTicket');
    return (
      <>
        <div className={styles.messages_list} ref={ref}>
          {list.map((message, i) => (
            <Message model={message} key={i} />
          ))}
        <div className={styles["chat-typing"]}>
          {isTyping && t("chatIsTyping")}
        </div>
        </div>
      </>
    );
  }
);
