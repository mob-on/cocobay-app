import { useLoading } from "@src/shared/context/LoadingContext";
import useLogger from "@src/shared/hooks/useLogger";
import { useCallback, useEffect } from "react";

interface IImageLoaderProps {
  srcList?: string[];
  src?: string;
}

/**
 * Loads the given image(s) and updates the LoadingContext accordingly.
 * TODO: Use this in place of next/image, so we can manually cache images!
 */
const ImageLoader = ({ src, srcList }: IImageLoaderProps) => {
  const { updateResourceStatus, resources } = useLoading();
  const logger = useLogger("ImageLoader");

  const loadImage = useCallback(
    (src) => {
      if (resources[src]) {
        logger.warn(`Resource ${src} already loaded. Skipping.`);
        return;
      }
      logger.debug(`Loading resource ${src}`);
      updateResourceStatus(src, "pending");
      const img = new Image();
      img.src = src;
      img.onload = () => updateResourceStatus(src, "loaded");
      img.onerror = () => updateResourceStatus(src, "errored");
    },
    [logger, resources, updateResourceStatus],
  );

  useEffect(() => {
    const srcToLoad = srcList ? srcList : [src];
    srcToLoad.forEach((src) => loadImage(src));
  }, [src, srcList, loadImage]);

  if (!src && !srcList) {
    logger.error("src or srcList is required");
    return null;
  }

  if (src && srcList) {
    logger.error("src and srcList are mutually exclusive");
    return null;
  }

  return null;
};

export default ImageLoader;
