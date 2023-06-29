import {Box} from "@mui/material";
import {ReactNode} from "react";
import {Sidebar} from "../components/Sidebars/Sidebar";
import {AuthHeader} from "../components/AuthHeader/AuthHeader";

export const MainPageLayout = ({children}: { children: ReactNode }) => {
  return (
    <Box>
      <AuthHeader/>

      <Box
        sx={{
          display: "flex",
          width: {
            xs: "100%",
            sm: "calc(100vw - 650px)",
            md: "calc(100vw - 650px)",
            xl: "calc(100vw - 650px)",
          },
          overflowY: "auto",
          overflowX: "hidden",
          height: "100%",
          maxHeight: {
            xs: "calc(100vh - 82px)",
            sm: "calc(100vh - 82px)"
          },
          position: "absolute",
          left: {
            xs: 0,
            sm: "650px",
            md: "650px",
            xl: "650px",
          },
          paddingLeft: {
            xs: "24px",
            sm: "24px",
            md: "24px",
            xl: "24px",
          },
          paddingTop: "20px",
          paddingRight: {
            xs: "24px",
            sm: "82px",
            md: "82px",
            xl: "82px",
          },
          paddingBottom: "24px",
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

      <Sidebar/>
    </Box>
  );
};
