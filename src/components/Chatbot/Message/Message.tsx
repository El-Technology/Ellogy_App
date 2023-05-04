import { FC } from "react";
import styles from "./Message.module.scss";
export interface IMessage {
  content: string;
  sender: string;
}
interface IMessageProps {
  model: IMessage;
}
export const Message: FC<IMessageProps> = ({ model }) => {
  return (
    <div
      className={styles.message}
      dangerouslySetInnerHTML={{ __html: model.content }}
    />
  );
};
