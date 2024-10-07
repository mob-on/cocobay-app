import { createContext } from "react";

export interface IAppError {
  message: string;
  dismissable?: boolean;
  onDismiss?: () => void;
}

export interface IErrorContext {
  showErrorScreen: (error: IAppError) => void;
  hideErrorScreen: () => void;
}

export const ErrorContext = createContext({} as IErrorContext);
