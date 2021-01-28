const avatarGenerator = require("js-image-generator");
const ErrorHeandler = require("./errorHeandler");
const { promises: fsPromises } = require("fs");
const path = require("path");

async function geterateAvatar(protocol, hostname) {
  const fileName = `${Date.now()}.jpg`;
  const avatarPath = path.join("tmp", fileName);
  const dest = path.join("public", "images", fileName);
  await avatarGenerator.generateImage(100, 100, 80, cb);
  async function cb(error, image) {
    if (error) {
      return new ErrorHeandler(error, 401);
    }
    await fsPromises.writeFile(avatarPath, image.data);
    await fsPromises.copyFile(avatarPath, dest);
    await fsPromises.unlink(avatarPath);
  }

  return `${protocol}://${hostname}:${process.env.PORT}/images/${fileName}`;
}

module.exports = geterateAvatar;
