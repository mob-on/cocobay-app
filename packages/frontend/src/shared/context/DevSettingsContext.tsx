import SettingOutlined from "@ant-design/icons/SettingOutlined";
import { createContext, useContext, useState } from "react";
import DevScreen from "src/pages/devSettings";
import { Feature } from "../lib/FeatureFlags";

export interface IDevSettingsContext {
  showDevSettings: () => void;
}

// context to store taps to give visual feedback for
const DevSettingsContext = createContext({} as IDevSettingsContext);
export const useDevSettingsContext = () => useContext(DevSettingsContext);
export default DevSettingsContext;

export const DevSettingsContextProvider: React.FC<{
  children: React.JSX.Element;
}> = ({ children }) => {
  const [shouldShowDevSettings, setShouldShowDevSettings] = useState(false);
  const devMode = Feature.DEV_MODE;
  return (
    <DevSettingsContext.Provider
      value={{
        showDevSettings: () => {
          setShouldShowDevSettings(true);
        },
      }}
    >
      {devMode ? (
        <>
          {shouldShowDevSettings && <DevScreen />}
          {!shouldShowDevSettings && children}
          {
            <SettingOutlined
              width={96}
              height={96}
              style={{
                position: "fixed",
                top: "var(--padding)",
                right: "var(--padding)",
                zIndex: 10000,
              }}
              onClick={() => setShouldShowDevSettings((value) => !value)}
            />
          }
        </>
      ) : (
        children
      )}
    </DevSettingsContext.Provider>
  );
};
