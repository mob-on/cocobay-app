import { useContext } from "react";

import { IResourcesContext, ResourcesContext } from "./Resources.context";

export const useResources = () =>
  useContext(ResourcesContext) as IResourcesContext;
