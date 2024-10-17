import { useContext } from "react";

import { LoadingContext } from "./Loading.context";

export const useLoadingScreen = () => useContext(LoadingContext);
