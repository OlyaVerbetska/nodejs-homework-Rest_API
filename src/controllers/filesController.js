const fs = require('fs').promises;
const jimp = require('jimp');
const { AVATARS_DIR } = require('../helpers/uploadTemp')
const path = require('path');
const { v4: uuidv4 } = require('uuid')

const avatarUpdater = async (req, res) => {
  if (req.file) {
    const { file } = req;
    // console.log(file)
    const ava = await jimp.read(file.path);
    ava
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(file.path);
    ava.resize(250, 250).writeAsync(file.path);
    const fileExt = file.originalname.split('.')
    const randomName = uuidv4()
    const newName = randomName + '.' + fileExt[1]
    file.originalname = newName
    console.log(file.originalname)
    await fs.rename(file.path, path.join(AVATARS_DIR, file.originalname));
    // console.log(file.originalname)
  }

  res.status(200).json({ message: 'file upload' });
};

module.exports = {
  avatarUpdater,
};
