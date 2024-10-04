"use client";

import { LoadingScreen } from "@src/components/LoadingScreen";
import { createContext, Suspense, useContext, useState } from "react";

export interface ILoadingContext {
  shouldShowLoading: boolean;
  hideLoading: () => void;
  showLoading: () => void;
}

// context to show/hide loading screen
const LoadingContext = createContext<ILoadingContext>({} as ILoadingContext);

export const useLoadingScreen = () => useContext(LoadingContext);

export const LoadingContextProvider: React.FC<{
  children: React.JSX.Element;
}> = ({ children }) => {
  const [shouldShowLoading, setShouldShowLoading] = useState(true);

  const hideLoading = () => setShouldShowLoading(false);
  const showLoading = () => setShouldShowLoading(true);
  return (
    <LoadingContext.Provider
      value={{
        shouldShowLoading,
        hideLoading,
        showLoading,
      }}
    >
      {shouldShowLoading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  );
};
