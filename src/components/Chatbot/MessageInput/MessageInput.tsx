import { KeyboardEvent, forwardRef } from "react";
import { IMessage } from "../Message/Message";
import styles from "./MessageInput.module.scss";
interface IMessageInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSend: (message: IMessage) => void;
  value: string;
  setValue: (value: string) => void;
}
export const MessageInput = forwardRef<HTMLInputElement, IMessageInputProps>(
  ({ onSend, placeholder = "", disabled = false, value, setValue }, ref) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && value.trim()) {
        onSend({ content: value, sender: "user" });
        setValue("");
      }
    };

    return (
      <input
        ref={ref}
        placeholder={placeholder}
        className={styles.message_input}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    );
  }
);
