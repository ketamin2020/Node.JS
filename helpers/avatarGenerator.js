const avatarGenerator = require("js-image-generator");
const ErrorHeandler = require("./errorHeandler");
const fs = require("fs");

async function geterateAvatar() {
  const dest = `tmp/avatar.jpeg`;
  const filePath = `public/images/${Date.now()}.jpeg`;
  await avatarGenerator.generateImage(100, 100, 80, cb);

  async function cb(error, image) {
    if (error) {
      return new ErrorHeandler(error, 401);
    }
    await fs.writeFileSync(dest, image.data);
    const tempFile = await fs.createReadStream(dest);
    const imageFile = await fs.createWriteStream(filePath);
    tempFile.pipe(imageFile);
  }

  return { dest, filePath };
}

module.exports = geterateAvatar;
