import { useLoading } from "@src/shared/context/LoadingContext";
import useLogger from "@src/shared/hooks/useLogger";
import { useEffect } from "react";

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

  useEffect(() => {
    if (!src && !srcList) {
      return;
    }
    const srcToLoad = srcList ? srcList : [src];
    srcToLoad.forEach((src) => loadImage(src));
  }, [src, srcList, updateResourceStatus]);

  if (!src && !srcList) {
    logger.error("src or srcList is required");
    return null;
  }

  if (src && srcList) {
    logger.error("src and srcList are mutually exclusive");
    return null;
  }

  const loadImage = (src) => {
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
  };

  return null;
};

export default ImageLoader;
