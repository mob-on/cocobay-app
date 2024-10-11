import { useLoadingScreen } from "@contexts/Loading";
import { useEffect } from "react";

/**
 * Hook to hide the loading screen.
 * We call it on every page, so that the loading screen is hidden when the page is fully loaded and is ready to be shown.
 */
export const useHideLoading = () => {
  const { hideLoading } = useLoadingScreen();
  useEffect(() => {
    hideLoading();
  }, [hideLoading]);
};
