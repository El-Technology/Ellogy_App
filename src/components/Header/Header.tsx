import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ReactComponent as Logo } from "../../assets/icons/logo.svg";

export const Header = () => {
  const { i18n } = useTranslation();
  const handleClick = (lang: string = "en") => {
    i18n.changeLanguage(lang);
  };
  return (
    <Box
      sx={{
        maxHeight: "71px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#000000",
        padding: {
          xs: "10px 25px 10px 25px",
          sm: "10px 82px 10px 91px",
          md: "10px 82px 10px 91px",
          xl: "10px 82px 10px 91px",
        },
        boxSizing: "content-box",
        borderBottom: "6px solid #C4C4C4 80%",
      }}
    >
      <Logo />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          boxSizing: "content-box",
        }}
      >
        <Button
          sx={{
            minWidth: "auto",
            padding: "10px",
          }}
          onClick={() => handleClick("ar")}
        >
          Ar
        </Button>

        <Button
          sx={{
            minWidth: "auto",
            padding: "10px",
          }}
          onClick={() => handleClick("en")}
        >
          En
        </Button>
        <img
          style={{ cursor: "pointer", marginLeft: "10px" }}
          src={require("../../assets/icons/user.png")}
          alt="Not found"
        />
      </Box>
    </Box>
  );
};
