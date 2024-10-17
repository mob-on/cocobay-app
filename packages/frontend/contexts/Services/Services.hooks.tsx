import { useContext } from "react";

import { ServicesContext } from "./Services.context";

export const useServices = () => {
  return useContext(ServicesContext);
};
