import { Box } from "@mui/material";
import { useState, FC, ReactNode, createContext, useMemo } from "react";
interface ICustomStepperContext {
  currentStep: number;
  totalSteps: number;
  handleNext: () => void;
  handleBack: () => void;
  handleConfirm: () => void;
}

export const CustomStepperContext = createContext<ICustomStepperContext>({
  currentStep: 0,
  totalSteps: 0,
  handleNext: () => {},
  handleBack: () => {},
  handleConfirm: () => {},
});
interface ICustomStepperProps {
  children: ReactNode[] | ReactNode;
  finalFunc: () => void;
}
export const CustomStepper: FC<ICustomStepperProps> = ({
  children,
  finalFunc,
}) => {
  const pages = Array.isArray(children) ? children : [children];
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = pages.length - 1;

  const handleNext = () => {
    setCurrentStep((curr) => curr + 1);
  };
  const handleBack = () => {
    setCurrentStep((curr) => curr - 1);
  };
  const handleConfirm = () => {
    finalFunc();
  };
  const contextValue = useMemo(
    () => ({
      currentStep,
      totalSteps,
      handleNext,
      handleBack,
      handleConfirm,
    }),
    [currentStep, totalSteps, handleNext, handleBack, handleConfirm]
  );
  return (
    <>
      <CustomStepperContext.Provider value={contextValue}>
        {pages[currentStep]}
      </CustomStepperContext.Provider>
    </>
  );
};
