import { DevSettingsProvider } from "@contexts/DevSettings";
import { QueryClient } from "@tanstack/react-query";
import { lazy } from "react";

// lazy load providers to reduce the time until we show our own loading screen
const DynamicResourcesProvider = lazy(
  () => import("./resourcesProviderContent"),
);

const DynamicErrorContextProvider = lazy(() =>
  import("@contexts/Errors").then((mod) => ({
    default: mod.ErrorProvider,
  })),
);

const DynamicQueryClientProvider = lazy(() => {
  return import("@tanstack/react-query").then((mod) => ({
    default: mod.QueryClientProvider,
  }));
});

const DynamicTrackingProvider = lazy(() =>
  import("@contexts/Tracking").then((mod) => ({
    default: mod.TrackingProvider,
  })),
);

const queryClient = new QueryClient();

export default function LayoutContent({ children }: { children: JSX.Element }) {
  return (
    <DevSettingsProvider>
      <DynamicQueryClientProvider client={queryClient}>
        <DynamicTrackingProvider>
          <DynamicErrorContextProvider>
            <DynamicResourcesProvider>{children}</DynamicResourcesProvider>
          </DynamicErrorContextProvider>
        </DynamicTrackingProvider>
      </DynamicQueryClientProvider>
    </DevSettingsProvider>
  );
}
