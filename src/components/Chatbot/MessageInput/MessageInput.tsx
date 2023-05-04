import { KeyboardEvent, useState, forwardRef } from "react";
import { IMessage } from "../Message/Message";
import styles from "./MessageInput.module.scss";
interface IMessageInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSend: (message: IMessage) => void;
}
export const MessageInput = forwardRef<HTMLInputElement, IMessageInputProps>(
  ({ onSend, placeholder = "", disabled = false }, ref) => {
    const [message, setMessage] = useState<string>("");
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && message.trim()) {
        onSend({ content: message, sender: "user" });
        setMessage("");
      }
    };

    return (
      <input
        ref={ref}
        placeholder={placeholder}
        className={styles.message_input}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
    );
  }
);
