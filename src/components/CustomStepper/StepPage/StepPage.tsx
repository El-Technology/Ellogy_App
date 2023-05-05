import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useContext, FC, ReactNode, useMemo } from "react";
import { CustomStepperContext } from "../CustomStepper";

interface IStepPageProps {
  children: ReactNode[] | ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  isButtonDisable?: boolean;
}

export const StepPage: FC<IStepPageProps> = ({
  onNext,
  onBack,
  children,
  isButtonDisable,
}) => {
  const { currentStep, totalSteps, handleBack, handleNext, handleConfirm } =
    useContext(CustomStepperContext);
  const { t } = useTranslation();

  const isLastStep = useMemo(() => currentStep === totalSteps, [currentStep, totalSteps]);

  const onBeforeHandler = () => {
    onBack?.();
    if (!!currentStep) {
      handleBack();
    }
  };

  const onNextHandler = () => {
    onNext?.();
    if (isLastStep) {
      handleConfirm();
    } else {
      handleNext();
    }
  };

  return (
    <>
      {children}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: "auto",
          gap: "15px",
          boxSizing: "border-box",
        }}
      >
        <Button
          className="rtl-able"
          onClick={onBeforeHandler}
          sx={{
            visibility: !currentStep ? "hidden" : "visible",
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
              opacity: { xs: '1', sm: "0.7" },
            },
            "&:disabled": {
              opacity: "0.7",
              color: "#fff",
              cursor: "not-allowed",
              pointerEvents: "auto",
            },
          }}
          disabled={isButtonDisable}
        >
          {t(!currentStep ? "clear" : "prev")}
        </Button>

        <Button
          className="rtl-able"
          onClick={onNextHandler}
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
            transition: "0.5s all",
            "&:hover": {
              bgcolor: "#000000",
              opacity: { xs: "1", sm: "0.7" },
            },
            "&:disabled": {
              opacity: "0.7",
              color: "#fff",
              cursor: "not-allowed",
              pointerEvents: "auto",
            },
          }}
          disabled={isButtonDisable}
        >
          {t(isLastStep ? "submit" : "next")}
        </Button>
      </Box>
    </>
  );
};
