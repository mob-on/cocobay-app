"use client";

import { SettingOutlined } from "@ant-design/icons";
import { Feature } from "@lib/FeatureFlags";
import DevScreen from "@src/components/DevScreen";
import { useState } from "react";

import { DevSettingsContext } from "./DevSettings.context";

export const DevSettingsProvider: React.FC<{
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
