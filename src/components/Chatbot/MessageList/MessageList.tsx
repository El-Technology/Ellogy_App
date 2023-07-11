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
    const { t } = useTranslation(["createTicket"], {
      useSuspense: false,
    });

    const welcomeMessage: IMessage = {
      content: t("welcome"),
      sender: "chatGPT",
      sendTime: "",
    };

    return (
      <>
        {list.length !== 0 ? (
          <div className={styles.messages_list} ref={ref}>
            {list.map((message, i) => (
              <Message model={message} key={i} />
            ))}
            <div className={styles["chat-typing"]}>
              {isTyping && t("chatIsTyping")} {/* Bad translate*/}
            </div>
          </div>
        ) : (
          <div className={styles.messages_list} ref={ref}>
            <Message model={welcomeMessage} />
          </div>
        )}
      </>
    );
  }
);
