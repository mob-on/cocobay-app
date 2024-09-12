import { useEffect } from "react";
import { useLoading } from "src//shared/context/LoadingContext";
import useLogger from "src//shared/hooks/useLogger";

interface IImageLoaderProps {
  srcList?: string[];
  src?: string;
}

/**
 * Loads the given image(s) and updates the LoadingContext accordingly.
 * NOTE: this should only be used for images that aren't benefitting from next/image + priority.
 * This component might not be useful, but it's there if we find a use case for it.
 * Requires a bit of research and testing!
 * @param {string|string[]} src - The source URL of the image to load, or an array of URLs.
 * @returns {null}
 */
const ImageLoader = ({ src, srcList }: IImageLoaderProps) => {
  const { updateResourceStatus, resources } = useLoading();
  const logger = useLogger("ImageLoader");

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

  useEffect(() => {
    const srcToLoad = srcList ? srcList : [src];
    srcToLoad.forEach((src) => loadImage(src));
  }, [src, srcList, updateResourceStatus]);

  return null;
};

export default ImageLoader;
