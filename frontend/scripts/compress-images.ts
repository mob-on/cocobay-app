import glob from "glob";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";

(async () => {
  const targetFolder = "out/";
  const removeFileNameRegex = new RegExp(/[^/]+$/);
  glob(
    `${targetFolder}**/*.{jpg,jpeg,png,svg}`,
    (err: any, paths: string[]) => {
      if (err) {
        console.error(err);
      } else {
        Promise.all(
          paths.map(async (item: string) => {
            return imagemin([item], {
              destination: item.replace(removeFileNameRegex, ""),
              plugins: [
                imageminJpegtran(),
                imageminPngquant({
                  quality: [0.6, 0.8],
                }),
                imageminWebp({ quality: 80 }),
                imageminSvgo({
                  plugins: [
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                  ],
                }),
              ],
            });
          }),
        ).then((result) => {
          console.info(`Finished compressing ${result.length} images`);
        });
      }
    },
  );
})();
