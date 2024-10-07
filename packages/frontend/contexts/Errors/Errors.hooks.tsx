import { useContext } from "react";

import { ErrorContext } from "./Errors.context";

export const useErrorContext = () => useContext(ErrorContext);
