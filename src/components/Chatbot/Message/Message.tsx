import { FC, memo, useMemo } from "react";
import cx from 'classnames';
import styles from "./Message.module.scss";
export interface IMessage {
  content: string;
  sender: string;
}
interface IMessageProps {
  model: IMessage;
}
export const Message: FC<IMessageProps> = memo(({ model }) => {
  const messageClasses = useMemo(() => model.sender === 'user'? styles['message__human']: styles['message__bot'] , [model.sender]);

  return (
    <div
      className={cx(styles.message, messageClasses, {
        "rtl-able": model.content.match("[\u0600-\u06FF\u0750-\u077F]"),
      })}
      dangerouslySetInnerHTML={{ __html: model.content }}
    />
  );
});
