import { Box, Typography } from "@mui/material";
import { ReactComponent as Edit } from "../../assets/icons/edit.svg";
import { ReactComponent as Help } from "../../assets/icons/help-circle.svg";
import { useTranslation } from "react-i18next";

export const Sidebar = () => {
  const { t } = useTranslation("navigation");

  return (
    <Box
      className="rtl-able"
      sx={{
        width: "91px",
        height: "calc(100vh - 70px)",
        paddingTop: "20px",
        paddingBottom: "16px",
        display: {
          xs: "none",
          sm: "flex",
          md: "flex",
          xl: "flex",
        },
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#000000",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Edit />
        <Typography
          sx={{
            mt: "3px",
            fontFamily: "Arvo",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "17.30px",
            color: "#C6C6C6",
          }}
        >
          {t("update")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Help />
        <Typography
          sx={{
            mt: "3px",
            fontFamily: "Arvo",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "17.30px",
            color: "#C6C6C6",
          }}
        >
          {t("help")}
        </Typography>
      </Box>
    </Box>
  );
};
