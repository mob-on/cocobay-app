import SettingOutlined from "@ant-design/icons/SettingOutlined";
import { createContext, useContext, useState } from "react";
import DevScreen from "src/pages/devSettings";

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
  return (
    <DevSettingsContext.Provider
      value={{
        showDevSettings: () => {
          setShouldShowDevSettings(true);
        },
      }}
    >
      {shouldShowDevSettings && <DevScreen />}
      {!shouldShowDevSettings && children}
      {
        <SettingOutlined
          width={96}
          height={96}
          style={{
            position: "fixed",
            right: "var(--padding)",
            bottom: "var(--padding)",
            zIndex: 1000,
          }}
          onClick={() => setShouldShowDevSettings((value) => !value)}
        />
      }
    </DevSettingsContext.Provider>
  );
};
