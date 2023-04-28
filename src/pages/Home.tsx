import { CreateRequest } from "src/components/CreateRequest/CreateRequest";
import { MainPageLayout } from "../layouts/MainPageLayout";

export const Home = () => {
  return (
    <MainPageLayout>
      <CreateRequest />
    </MainPageLayout>
  );
};
