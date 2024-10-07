import { useContext } from "react";

import { BuildsContext } from "./Builds.context";

export const useBuilds = () => useContext(BuildsContext);
