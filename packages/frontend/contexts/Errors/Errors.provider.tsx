"use client";

import Button from "@src/components/shared/Button";
import { Feature } from "@src/lib/FeatureFlags";
import Popup from "antd-mobile/es/components/popup";
import { CloseCircleFill } from "antd-mobile-icons";
import { useMemo, useState } from "react";

import { ErrorContext, IAppError } from "./Errors.context";

export const ErrorProvider: React.FC<{
  children: React.JSX.Element;
}> = ({ children }) => {
  const [error, setError] = useState<IAppError | null>(null);
  const devMode = Feature.DEV_MODE;

  const closeHandler = useMemo(
    () =>
      error?.dismissable
        ? () => {
            setError({ message: "" } as IAppError);
            if (error.onDismiss) {
              error.onDismiss();
            }
          }
        : null,
    [error?.dismissable, error?.onDismiss],
  );

  const showCloseButton = error?.dismissable && closeHandler !== null;

  const contextValue = {
    showErrorScreen: (error: IAppError) => {
      setError(error);
    },
    hideErrorScreen: () => setError({} as IAppError),
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {devMode ? (
        <>
          {error?.message && (
            <Popup
              position="bottom"
              visible={error?.message.length > 0}
              showCloseButton={showCloseButton}
              onClose={closeHandler ? closeHandler : undefined}
              bodyClassName="__error-popup"
            >
              <CloseCircleFill width={32} height={32} color="red" />
              <h3>{devMode ? error.message : "There was an error!"}</h3>
              {showCloseButton && (
                <Button style={{ marginTop: "auto" }} onClick={closeHandler}>
                  Okay
                </Button>
              )}
            </Popup>
          )}
          {!error?.message && children}
        </>
      ) : (
        children
      )}
    </ErrorContext.Provider>
  );
};
