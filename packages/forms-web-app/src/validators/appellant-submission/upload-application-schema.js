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
  'application-upload': {
    custom: {
      options: async (value, { req, path }) => {
        const { appeal } = req.session;

        const noFilePreviouslyUploaded =
          !appeal || !appeal.requiredDocumentsSection.originalApplication.uploadedFile.id;

        const noNewFileUploaded =
          !req.files || Object.keys(req.files).length === 0 || !req.files[path];

        if (noFilePreviouslyUploaded) {
          if (noNewFileUploaded) {
            throw new Error('Select a planning application form');
          }
        } else if (noNewFileUploaded) {
          return true;
        }

        // check file extension type
        const { mimetype } = req.files[path];

        validMimeType(
          mimetype,
          [MIME_TYPE_DOC, MIME_TYPE_DOCX, MIME_TYPE_PDF, MIME_TYPE_TIF, MIME_TYPE_JPEG, MIME_TYPE_PNG],
          'The file is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
        );

        // check binary mime type of file
        const fileStream = fs.createReadStream(req.files['application-upload'].tempFilePath);
        const fileStreamType = await fileContentTypegit st.fromStream(fileStream);

        const fileBinaryMime = fileStreamType?.mime || null;

        // var fileBinaryMime = '';
        //
        // if (typeof fileStreamType != 'undefined')
        // {
        //    const {mime} = fileStreamType;
        //
        //    fileBinaryMime = mime;
        // }

        validMimeType(
          fileBinaryMime,
            [MIME_BINARY_TYPE_DOC, MIME_TYPE_DOCX, MIME_TYPE_PDF, MIME_TYPE_TIF, MIME_TYPE_JPEG, MIME_TYPE_PNG],
            'The files is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
          );

        // check file size
        const { size } = req.files[path];

        validateFileSize(size, config.fileUpload.pins.uploadApplicationMaxFileSize);
        console.log ('end statement');
        return true;
      },
    },
  },
};
