import { useContext } from "react";

import { ServiceContext } from "./Services.context";

export const useServices = () => {
  return useContext(ServiceContext);
};
