import {
  Image as BootstrapImage,
  ImageProps as BootstrapImageProps,
} from "react-bootstrap";

const loader = (
  src: string,
  isExternal: boolean,
  transformToWebp = false,
): string => {
  if (isExternal) {
    return src;
  }

  if (transformToWebp) {
    if (process.env.NODE_ENV === "development") {
      src += "?webp";
    } else {
      src = src.replace(/[.][^.]+$/, ".webp");
    }
  }

  return src;
};

interface ImageProps
  extends BootstrapImageProps,
    React.RefAttributes<HTMLImageElement> {
  src: string | any;
  useWebp?: boolean;
}

/**
 * An image with support for WebP format
 * @returns
 */
const Image = ({ src, useWebp = true, ...props }: ImageProps) => {
  //Support for images imported through require
  //(where source is defined inside the "default" property of the module)
  src = src?.default?.src ?? src;

  const isExternal =
    src.indexOf("http://") === 0 || src.indexOf("https://") === 0;
  const isSvg = src.indexOf(".svg") === src.length - ".svg".length;
  const isData = src.indexOf("data:") === 0;

  return useWebp === true && !isExternal && !isSvg && !isData ? (
    <picture>
      <source srcSet={loader(src, isExternal, true)} type="image/webp" />
      <BootstrapImage src={loader(src, isExternal)} {...props} />
    </picture>
  ) : (
    <BootstrapImage src={loader(src, isExternal)} {...props} />
  );
};

export default Image;
