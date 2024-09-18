import { useEffect } from "react";

/**
 * useOnDocumentUnload
 *
 * Adds a callback to be called when the user unloads the document. This includes
 * when the user clicks the back button, closes the browser tab, or closes the
 * browser window.
 *
 * @param callback - the callback to be called. Memoize it!
 */
const useOnDocumentUnload = (callback: () => void) => {
  useEffect(() => {
    // in case the callback changes
    window.removeEventListener("beforeunload", callback);
    window.addEventListener("beforeunload", callback);
    return () => {
      window.removeEventListener("beforeunload", callback);
    };
  }, [callback]);
};

export default useOnDocumentUnload;
