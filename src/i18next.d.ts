import "react-i18next";
import common from "locales/en/common.json";
import inputs from "locales/en/inputs.json";
import navigation from "locales/en/navigation.json";
import createTicket from "locales/en/createTicket.json";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
      inputs: typeof inputs;
      navigation: typeof navigation;
      createTicket: typeof createTicket;
    };
  }
}
