import { Chatbot } from "../Chatbot/Chatbot";
import { CustomStepper } from "../CustomStepper/CustomStepper";
import { UserStories } from "../UserStories/UserStories";
import { TicketForm } from "../TicketForm/TicketForm";
import { useForm, FormProvider } from "react-hook-form";
import { IMessage } from "../Chatbot/Message/Message";
import { StepPage } from "../CustomStepper/StepPage/StepPage";

interface FormValues {
  title: string;
  description: string;
  messages: IMessage[];
  summary: string;
}

export const CreateRequest = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      messages: [],
      summary: "",
    },
  });
  const { handleSubmit, reset } = methods;
  const onSubmit = (data: FormValues) => {
    console.log("res data is ", data);
    reset();
  };

  return (
    <FormProvider {...methods}>
      <CustomStepper finalFunc={handleSubmit(onSubmit)}>
        <StepPage>
          <TicketForm />
        </StepPage>
        <StepPage
          onBack={() => {
            reset();
          }}
        >
          <Chatbot />
        </StepPage>
        <StepPage
          onNext={() => {
            reset();
          }}
        >
          <UserStories />
        </StepPage>
      </CustomStepper>
    </FormProvider>
  );
};
