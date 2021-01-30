const path = require("path");
const { promises: fsPromises } = require("fs");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
module.exports = async function minifyImage(req, res, next) {
  try {
    const MINIFIED_IMG = "public/images";
    await imagemin([`tmp/${req.file.filename}`], {
      destination: MINIFIED_IMG,
      plugins: [
        imageminJpegtran({ quality: 50 }),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
    await fsPromises.unlink(req.file.path);
    req.file = {
      ...req.file,
      path: path.join(MINIFIED_IMG, req.file.filename),
      destination: MINIFIED_IMG,
    };
    next();
  } catch (err) {
    next(err);
  }
};
