import React, { FC, memo, useMemo } from "react";
import cx from "classnames";
import styles from "./Message.module.scss";
import { Box, Typography } from "@mui/material";
import { ReactComponent as UserAvatar } from "../../../assets/icons/avatar.svg";
import { ReactComponent as EllogyAvatar } from "../../../assets/icons/ellogy-circle.svg";

export interface IMessage {
  content: string;
  sender: string;
  sendTime: string;
}

interface IMessageProps {
  model: IMessage;
}

export const Message: FC<IMessageProps> = memo(({ model }) => {
  const messageClasses = useMemo(
    () =>
      model.sender === "user"
        ? styles["message__human"]
        : styles["message__bot"],
    [model.sender]
  );
  const messageWrapperClasses = useMemo(
    () =>
      model.sender === "user"
        ? styles["messageWrapper__human"]
        : styles["messageWrapper__bot"],
    [model.sender]
  );
  const messageWrapperInfo = useMemo(
    () =>
      model.sender === "user"
        ? styles["messageWrapper__info--human"]
        : styles["messageWrapper__info--bot"],
    [model.sender]
  );

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <Box className={cx(styles.messageWrapper, messageWrapperClasses)}>
      {model.sender === "chatGPT" && <EllogyAvatar />}

      <Box className={cx(styles.messageWrapper__info, messageWrapperInfo)}>
        <Typography sx={{ fontWeight: "700", color: "#102142" }}>
          {model.sender === "chatGPT"
            ? "Ellogy"
            : `${user?.firstName} ${user?.lastName}`}
        </Typography>

        <Box
          className={cx(styles.message, messageClasses, {
            "rtl-able": model.content.match("[\u0600-\u06FF\u0750-\u077F]"),
          })}
          dangerouslySetInnerHTML={{ __html: model.content }}
        />
      </Box>

      {model.sender === "user" && (
        <UserAvatar className={styles.messageWrapper__avatar} />
      )}
    </Box>
  );
});
