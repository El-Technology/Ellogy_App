import { FC, useMemo } from "react";
import cx from 'classnames';
import styles from "./Message.module.scss";
export interface IMessage {
  content: string;
  sender: string;
}
interface IMessageProps {
  model: IMessage;
}
export const Message: FC<IMessageProps> = ({ model }) => {
  const messageClasses = useMemo(() => model.sender === 'user'? styles['message__human']: styles['message__bot'] , [model.sender]);
  console.log('model', model);

  return (
    <div
      className={cx(styles.message, messageClasses)}
      dangerouslySetInnerHTML={{ __html: model.content }}
    />
  );
};
