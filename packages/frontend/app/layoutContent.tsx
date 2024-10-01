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

/* The idea is to lazy load all context providers, so that we don't bundle them, 
and show the loading screen quicker. Then, we don't unmount them, unless the page reloads. 
All of those contexts get their initial data from resources, fetched during loading 
and manage their own state afterwards. */

const DynamicBoostsContextProvider = lazy(() =>
  import("@src/shared/context/BoostsContext").then((mod) => ({
    default: mod.BoostsContextProvider,
  })),
);

const DynamicBuildsContextProvider = lazy(() =>
  import("@src/shared/context/BuildsContext").then((mod) => ({
    default: mod.BuildsContextProvider,
  })),
);

const DynamicFriendsContextProvider = lazy(() =>
  import("@src/shared/context/FriendsContext").then((mod) => ({
    default: mod.FriendsContextProvider,
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
              <DynamicLoadingProvider>
                <DynamicBoostsContextProvider>
                  <DynamicBuildsContextProvider>
                    <DynamicFriendsContextProvider>
                      {children}
                    </DynamicFriendsContextProvider>
                  </DynamicBuildsContextProvider>
                </DynamicBoostsContextProvider>
              </DynamicLoadingProvider>
            </DynamicErrorContextProvider>
          </DynamicTrackingProvider>
        </DynamicQueryClientProvider>
      </DynamicDevSettingsContextProvider>
    </DynamicLocalStorageContextProvider>
  );
}
