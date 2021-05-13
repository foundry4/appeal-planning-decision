const fileContentType = require('file-type');
const fs = require('fs');
const config = require('../../config');
const validateFileSize = require('../custom/file-size');
const validMimeType = require('../custom/mime-type');
const {
  MIME_TYPE_DOC,
  MIME_BINARY_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
} = require('../../lib/mime-types');

module.exports = {
  'files.supporting-documents.*': {
    custom: {
      options: async (value) => {
        const { name, mimetype, size } = value;

        // check file extension type
        validMimeType(
          mimetype,
          [
            MIME_TYPE_DOC,
            MIME_TYPE_DOCX,
            MIME_TYPE_PDF,
            MIME_TYPE_JPEG,
            MIME_TYPE_TIF,
            MIME_TYPE_PNG,
          ],
          `${name} is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG`
        );

        // check binary mime type of file
        const fileStream = fs.createReadStream(value.tempFilePath);
        const fileStreamType = await fileContentType.fromStream(fileStream);

        const fileBinaryMime = fileStreamType?.mime || null;

        validMimeType(
          fileBinaryMime,
          [
            MIME_BINARY_TYPE_DOC,
            MIME_TYPE_DOCX,
            MIME_TYPE_PDF,
            MIME_TYPE_TIF,
            MIME_TYPE_JPEG,
            MIME_TYPE_PNG,
          ],
          'The files is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
        );

        // check file size
        validateFileSize(size, config.fileUpload.pins.uploadApplicationMaxFileSize, name);

        return true;
      },
    },
  },
};
