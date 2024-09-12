import { Popup, Space } from "antd-mobile";
import { CloseCircleFill, CloseOutline } from "antd-mobile-icons";
import { createContext, useContext, useMemo, useState } from "react";
import Button from "src/components/shared/Button";

import { Feature } from "../lib/FeatureFlags";

export interface IErrorContext {
  showErrorScreen: (error: IAppError) => void;
}

export interface IAppError {
  message: string;
  dismissable?: boolean;
  // NOTE: onDismiss should be wrapped in useCallback/useMemo
  onDismiss?: () => void;
}

// context to store taps to give visual feedback for
const ErrorContext = createContext({} as IErrorContext);
export const useErrorContext = () => useContext(ErrorContext);
export default ErrorContext;

// Context provider for showing user-readable errors
export const ErrorContextProvider: React.FC<{
  children: React.JSX.Element;
}> = ({ children }) => {
  const [error, setError] = useState<IAppError>({} as IAppError);
  const devMode = Feature.DEV_MODE;

  const closeHandler = useMemo(
    () =>
      error.dismissable
        ? () => {
            setError({ message: "" } as IAppError);
            if (error.onDismiss) {
              error.onDismiss();
            }
          }
        : null,
    [error?.dismissable, error?.onDismiss],
  );

  const showCloseButton = error.dismissable && closeHandler !== null;

  return (
    <ErrorContext.Provider
      value={{
        showErrorScreen: (error: IAppError) => {
          setError(error);
        },
      }}
    >
      {devMode ? (
        <>
          {error.message && (
            <Popup
              position="bottom"
              visible={error?.message.length > 0}
              showCloseButton={showCloseButton}
              onClose={closeHandler}
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
