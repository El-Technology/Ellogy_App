import {Box} from "@mui/material";
import {ReactNode} from "react";
import {Sidebar} from "../components/Sidebars/Sidebar";
import {Header} from "../components/Header/Header";

export const MainPageLayout = ({children}: { children: ReactNode }) => {
  return (
    <>
      <Header/>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Box
          sx={{
            width: "calc((100% - 1370px) / 2)",
            height: "calc(100vh - 82px)",
            display: "flex",
            justifyContent: "center",
            background: "#FBFBFB"
          }}
        >
        </Box>

        <Box
          sx={{
            display: "flex",
            maxWidth: "1370px",
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <Sidebar/>

          <Box
            sx={{
              width: "calc(100% - 20px)",
              display: "flex",
              overflowY: "auto",
              overflowX: "hidden",
              height: "calc(100vh - 82px)",
              padding: "20px 0 20px 24px",
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

        <Box
          sx={{
            width: "calc((100% - 1370px) / 2)",
            height: "calc(100vh - 82px)",
            display: "flex",
            justifyContent: "center",
          }}
        >
        </Box>
      </Box>
    </>
  );
};
