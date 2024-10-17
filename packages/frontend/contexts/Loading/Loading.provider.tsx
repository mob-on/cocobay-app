"use client";

import { LoadingScreen } from "@src/components/LoadingScreen";
import { useState } from "react";

import { LoadingContext } from "./Loading.context";

export const LoadingProvider: React.FC<{
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
