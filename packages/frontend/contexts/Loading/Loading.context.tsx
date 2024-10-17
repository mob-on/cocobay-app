import { createContext } from "react";

export interface ILoadingContext {
  shouldShowLoading: boolean;
  hideLoading: () => void;
  showLoading: () => void;
}

export const LoadingContext = createContext<ILoadingContext>(
  {} as ILoadingContext,
);
