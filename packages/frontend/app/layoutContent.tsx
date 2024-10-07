import { DevSettingsProvider } from "@contexts/DevSettings";
import { QueryClient } from "@tanstack/react-query";
import { lazy } from "react";

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

/* The idea is to lazy load all context providers, so that we don't bundle them, 
and show the loading screen quicker. Then, we don't unmount them, unless the page reloads. 
All of those contexts get their initial data from resources, fetched during loading 
and manage their own state afterwards. */

const DynamicBoostsContextProvider = lazy(() =>
  import("@contexts/Boosts").then((mod) => ({
    default: mod.BoostsProvider,
  })),
);

const DynamicBuildsContextProvider = lazy(() =>
  import("@contexts/Builds").then((mod) => ({
    default: mod.BuildsProvider,
  })),
);

const DynamicFriendsContextProvider = lazy(() =>
  import("@contexts/Friends").then((mod) => ({
    default: mod.FriendsProvider,
  })),
);

const queryClient = new QueryClient();

export default function LayoutContent({ children }: { children: JSX.Element }) {
  return (
    <DevSettingsProvider>
      <DynamicQueryClientProvider client={queryClient}>
        <DynamicTrackingProvider>
          <DynamicErrorContextProvider>
            <DynamicResourcesProvider>
              <DynamicBoostsContextProvider>
                <DynamicBuildsContextProvider>
                  <DynamicFriendsContextProvider>
                    {children}
                  </DynamicFriendsContextProvider>
                </DynamicBuildsContextProvider>
              </DynamicBoostsContextProvider>
            </DynamicResourcesProvider>
          </DynamicErrorContextProvider>
        </DynamicTrackingProvider>
      </DynamicQueryClientProvider>
    </DevSettingsProvider>
  );
}
