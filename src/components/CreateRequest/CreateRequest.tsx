import { Chatbot } from "../Chatbot/Chatbot";
import { StepFlow } from "../StepFlow";
import { UserStories } from "../UserStories/UserStories";

export const CreateRequest = () => {
  return (
    <>
      <StepFlow>
        <Chatbot />
        <UserStories />
      </StepFlow>
    </>
  );
};
