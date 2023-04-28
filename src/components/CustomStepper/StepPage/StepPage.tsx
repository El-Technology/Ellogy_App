import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useContext, FC, ReactNode } from "react";
import { CustomStepperContext } from "../CustomStepper";

interface IStepPageProps {
  children: ReactNode[] | ReactNode;
  onNext?: () => void;
  onBack?: () => void;
}

export const StepPage: FC<IStepPageProps> = ({ onNext, onBack, children }) => {
  const { currentStep, totalSteps, handleBack, handleNext, handleConfirm } =
    useContext(CustomStepperContext);
  const { t } = useTranslation();
  return (
    <>
      {children}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: "auto",
        }}
      >
        <Button
          className="rtl-able"
          onClick={
            currentStep === 0
              ? () => {}
              : () => {
                  handleBack();
                  onBack && onBack();
                }
          }
          sx={{
            visibility: currentStep === 0 ? "hidden" : "visible",
            width: "131px",
            minHeight: "41px",
            height: "41px",
            textAlign: "center !important",
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
          {t(currentStep === 0 ? "clear" : "prev")}
        </Button>

        <Button
          className="rtl-able"
          onClick={
            currentStep === totalSteps
              ? () => {
                  handleConfirm();
                  onNext && onNext();
                }
              : () => {
                  handleNext();
                  onNext && onNext();
                }
          }
          sx={{
            width: "131px",
            height: "41px",
            textAlign: "center !important",
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
          {t(currentStep === totalSteps ? "submit" : "next")}
        </Button>
      </Box>
    </>
  );
};
