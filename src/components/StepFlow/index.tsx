import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, FC, ReactNode } from "react";

interface IStepFlowProps {
  children: ReactNode[];

}

export const StepFlow: FC<IStepFlowProps> = ({ children }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const { t } = useTranslation();
  const isLast = stepIndex === children.length - 1;
  const isFirst = stepIndex === 0;
  const nextPage = () => {
    setStepIndex((prev) => prev + 1);

  };
  const prevPage = () => {
    setStepIndex((prev) => prev - 1);
  };

  return (
    <>
      {children[stepIndex]}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          className="rtl-able"
          type={isFirst ? "reset" : "button"}
          onClick={!isFirst ? prevPage : () => {}}
          sx={{
            width: "131px",
            minHeight: "41px",
            height: "41px",
            my: {
              xs: "10px",
              sm: "15px",
              md: "15px",
              xl: "15px",
            },
            alignSelf: {
              xs: "flex-start",
              sm: "flex-end",
              md: "flex-end",
              xl: "flex-end",
            },
            bgcolor: "#000000",
            color: "white",
            zIndex: 0,
            "&:hover": {
              transition: "0.5s opacity",
              bgcolor: "#000000",
              opacity: "0.7",
            },
          }}
        >
          {t(isFirst ? "clear" : "prev")}
        </Button>

        <Button
          className="rtl-able"
          type={isLast ? "submit" : "button"}
          onClick={!isLast ? nextPage : () => {}}
          sx={{
            width: "131px",
            height: "41px",
            my: {
              xs: "10px",
              sm: "15px",
              md: "15px",
              xl: "15px",
            },
            alignSelf: "flex-end",
            bgcolor: "#000000",
            color: "white",
            zIndex: 0,
            "&:hover": {
              transition: "0.5s opacity",
              bgcolor: "#000000",
              opacity: "0.7",
            },
          }}
        >
          {t(isLast ? "submit" : "next")}
        </Button>
      </Box>
    </>
  );
};
