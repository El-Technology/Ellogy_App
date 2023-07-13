import React, { KeyboardEvent, forwardRef } from "react";
import { IMessage } from "../Message/Message";
import { Button } from "@mui/material";
import { ReactComponent as Send } from "../../../assets/icons/send.svg";
import cx from "classnames";
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
    const handleSend = () => {
      if (value.trim() && !disabled) {
        onSend({
          content: value.trim(),
          sender: "user",
          sendTime: new Date().toISOString(),
        });
        setValue("");
      }
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSend();
      }
    };

    return (
      <>
        <input
          ref={ref}
          placeholder={placeholder}
          className={cx(styles.message_input, "rtl-able")}
          onKeyDown={handleKeyDown}
          onChange={(e) => setValue(e.target.value)}
          value={value}
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
          onClick={() => handleSend()}
          disabled={disabled}
          variant="contained"
          color="primary"
        >
          <Send />
        </Button>
      </>
    );
  }
);
