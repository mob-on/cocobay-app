import { QueryClient } from "@tanstack/react-query";
import { lazy } from "react";

const DynamicLoadingProvider = lazy(() => import("./loadingProviderContent"));

const DynamicLocalStorageContextProvider = lazy(() =>
  import("@src/shared/context/LocalStorageContext").then((mod) => ({
    default: mod.LocalStorageContextProvider,
  })),
);

const DynamicDevSettingsContextProvider = lazy(() =>
  import("@src/shared/context/DevSettingsContext").then((mod) => ({
    default: mod.DevSettingsContextProvider,
  })),
);

const DynamicErrorContextProvider = lazy(() =>
  import("@src/shared/context/ErrorContext").then((mod) => ({
    default: mod.ErrorContextProvider,
  })),
);

const DynamicQueryClientProvider = lazy(() => {
  return import("@tanstack/react-query").then((mod) => ({
    default: mod.QueryClientProvider,
  }));
});

const DynamicTrackingProvider = lazy(() =>
  import("@src/shared/context/TrackingContext").then((mod) => ({
    default: mod.TrackingProvider,
  })),
);

const queryClient = new QueryClient();

export default function LayoutContent({ children }: { children: JSX.Element }) {
  return (
    <DynamicLocalStorageContextProvider>
      <DynamicDevSettingsContextProvider>
        <DynamicQueryClientProvider client={queryClient}>
          <DynamicTrackingProvider>
            <DynamicErrorContextProvider>
              <DynamicLoadingProvider>{children}</DynamicLoadingProvider>
            </DynamicErrorContextProvider>
          </DynamicTrackingProvider>
        </DynamicQueryClientProvider>
      </DynamicDevSettingsContextProvider>
    </DynamicLocalStorageContextProvider>
  );
}
