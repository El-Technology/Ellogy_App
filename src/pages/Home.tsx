import { CreateRequest } from "src/components/CreateRequest/CreateRequest";
import { MainPageLayout } from "../layouts/MainPageLayout";
import React from "react";

export const Home = () => {
  return (
    <MainPageLayout>
      <CreateRequest />
    </MainPageLayout>
  );
};
