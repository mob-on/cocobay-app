import { useContext } from "react";

import { type IResourcesContext, ResourcesContext } from "./Resources.context";

export const useResources = () =>
  useContext(ResourcesContext) as IResourcesContext;
