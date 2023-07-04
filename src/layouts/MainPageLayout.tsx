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
          display: "flex"
        }}
      >
        <Sidebar/>

        <Box
          sx={{
            display: "flex",
            overflowY: "auto",
            overflowX: "hidden",
            height: "calc(100vh - 82px)",
            padding: "20px 24px",
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
      </Box>
    </Box>
  );
};
