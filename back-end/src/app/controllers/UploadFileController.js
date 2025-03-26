const { StatusCodes } = require('http-status-codes');
const { uploadFile } = require('../../utils/UploadFile');
const HandleCode = require('../../utils/HandleCode');

class UploadFileController {
  async uploadFileToCloud(req, res) {
    try {
      const imageUrl = await uploadFile(req.file, HandleCode.FB_UPLOAD_FILE_PATH);
      return res.status(StatusCodes.OK).json({ imageUrl: imageUrl });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}

module.exports = new UploadFileController();
