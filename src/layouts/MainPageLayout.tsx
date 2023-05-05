import { Box } from "@mui/material";
import { ReactNode } from "react";
import { Header } from "../components/Header/Header";
import { Sidebar } from "../components/Sidebars/Sidebar";

export const MainPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box>
      <Header />
      <Box
        sx={{
          display: "flex",
          width: {
            xs: "100%",
            sm: "calc(100vw - 91px)",
            md: "calc(100vw - 91px)",
            xl: "calc(100vw - 91px)",
          },
          overflowY: "auto",
          overflowX: "hidden",
          height: "auto",
          minHeight: "calc(100vh - 70px)",
          maxHeight: {
            xs: "auto",
            sm: "calc(100vh - 70px)"
          },
          position: "absolute",
          left: {
            xs: 0,
            sm: "91px",
            md: "91px",
            xl: "91px",
          },
          paddingLeft: {
            xs: "20px",
            sm: "70px",
            md: "70px",
            xl: "70px",
          },
          paddingTop: "20px",
          paddingRight: {
            xs: "20px",
            sm: "82px",
            md: "82px",
            xl: "82px",
          },
          backgroundColor: "#EFEFEF",
          boxSizing: "border-box",
        }}
      >
        <Box
          position="relative"
          display={"flex"}
          flexDirection={"column"}
          flexGrow={1}
          height="100%"
        >
          {children}
        </Box>
      </Box>

      <Sidebar />
    </Box>
  );
};
