import React, { createRef, FC } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";
import cx from "classnames";

// store
import { TicketType } from "../../store/ticket-service/types";

// core
import { Statuses } from "../../core/enums/common";
import useTooltip from "../../core/hooks/useTooltip";

// styles
import styles from "./Sidebar.module.scss";

interface SidebarTicketProps {
  ticket: TicketType;
  handleTicketClick: (ticket: TicketType) => void;
  activeTicket: TicketType | null;
}

export const SidebarTicket: FC<SidebarTicketProps> = ({
  ticket,
  handleTicketClick,
  activeTicket,
}) => {
  const itemTitleRef = createRef<HTMLDivElement>();
  const isTooltipVisible = useTooltip(itemTitleRef);

  return (
    <Box
      sx={{
        display: "flex",
        cursor: "pointer",
        width: "227px",
        height: "49px",
        background: ticket === activeTicket ? "#ECF3FF" : "#fff",
        borderRadius: "8px",
        padding: "8px 12px",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onClick={() => handleTicketClick(ticket)}
    >
      <Box
        sx={{
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Tooltip
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "#f5f5f9",
                  color: "rgba(0, 0, 0, 0.87)",
                  fontSize: "12px",
                  maxWidth: 250,
                  border: "1px solid #dadde9",
                  "& .MuiTooltip-popper": { margin: 0 },
                },
              },
            }}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -15],
                  },
                },
              ],
            }}
            title={isTooltipVisible ? ticket.title : null}
            placement="top"
          >
            <Typography
              ref={itemTitleRef}
              sx={{
                fontWeight: "700",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: "135px",
              }}
            >
              {ticket.title}
            </Typography>
          </Tooltip>
        </Box>

        <Typography sx={{ color: "#707A8E" }}>
          {format(new Date(ticket.createdDate), "dd/MM/yyyy")}
        </Typography>
      </Box>
      {ticket && (
        <Box>
          <Typography
            className={cx(
              styles.status,
              styles[
                `status_${Statuses[ticket.status]
                  .split(" ")
                  .join("")
                  .toLowerCase()}`
              ]
            )}
          >
            {Statuses[ticket.status]}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
