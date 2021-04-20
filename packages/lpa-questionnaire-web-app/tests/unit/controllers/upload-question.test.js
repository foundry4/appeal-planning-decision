const uploadQuestionController = require('../../../src/controllers/upload-question');
const {
  fileErrorSummary,
  fileUploadNunjucksVariables,
  deleteFile,
  uploadFiles,
} = require('../../../src/lib/file-upload-helpers');
const logger = require('../../../src/lib/logger');
const { updateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { VIEW } = require('../../../src/lib/views');
const { getTaskStatus } = require('../../../src/services/task.service');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/lib/file-upload-helpers');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/upload-question', () => {
  const backLinkUrl = '/mock-id/mock-back-link';
  let req;
  let res;
  let mockAppealReply;

  beforeEach(() => {
    mockAppealReply = {
      mockSection: {
        mockTask: {
          uploadedFiles: [],
        },
      },
      sectionStates: {
        mockSection: {
          mockTask: 'NOT_STARTED',
        },
      },
    };

    req = mockReq(mockAppealReply);
    res = {
      ...mockRes(),
      locals: {
        routeInfo: {
          sectionName: 'mockSection',
          taskName: 'mockTask',
          view: 'mock-view',
          name: 'Mock Name',
        },
      },
    };

    jest.resetAllMocks();
  });

  describe('getUpload', () => {
    it('should call the correct template', () => {
      req.session.backLink = backLinkUrl;

      uploadQuestionController.getUpload(req, res);

      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: backLinkUrl,
      });
    });

    it('it should have the correct back link when no request session object exists.', () => {
      uploadQuestionController.getUpload(req, res);

      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
      });
    });

    it('it should show files if they are available', () => {
      const uploadedFiles = [{ name: 'mock-file' }, { name: 'another-file' }];
      req.session.appealReply.mockSection.mockTask = uploadedFiles;

      fileUploadNunjucksVariables.mockReturnValue({
        uploadedFiles,
      });

      uploadQuestionController.getUpload(req, res);

      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        uploadedFiles,
      });
    });
  });

  describe('postUpload', () => {
    it('should delete a document from temporary files if delete is passed', async () => {
      fileUploadNunjucksVariables.mockReturnValue({
        uploadedFiles: [{ name: 'another-file' }],
      });

      const mockRequest = {
        ...req,
        body: {
          delete: 'some-file',
        },
        session: {
          uploadedFiles: [{ name: 'some-file' }, { name: 'another-file' }],
        },
      };

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(deleteFile).toHaveBeenCalledWith('some-file', mockRequest);
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
        uploadedFiles: [{ name: 'another-file' }],
      });
    });

    it('should log an error if delete function returns one', async () => {
      deleteFile.mockImplementation(() => {
        throw new Error('mock delete error');
      });

      const mockRequest = {
        ...req,
        body: {
          delete: 'some-file',
        },
      };

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(logger.error).toHaveBeenCalledWith(
        { err: new Error('mock delete error') },
        'Error deleting some-file from Mock Name'
      );
    });

    it('should upload any files and add to session if submit not clicked and reload page', async () => {
      fileUploadNunjucksVariables.mockReturnValue({
        uploadedFiles: [{ name: 'some-file' }],
      });

      const mockRequest = {
        ...req,
        body: {
          files: {
            documents: [
              {
                name: 'some-file',
              },
            ],
          },
        },
      };

      uploadFiles.mockReturnValue([{ name: 'some-file' }]);

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(mockRequest.session.uploadedFiles).toEqual([{ name: 'some-file' }], mockRequest);
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
        uploadedFiles: [{ name: 'some-file' }],
      });
    });

    it('should add to existing session files if files present and submit not clicked, then reload page', async () => {
      fileUploadNunjucksVariables.mockReturnValue({
        uploadedFiles: [{ name: 'original-file' }, { name: 'some-file' }],
      });

      const mockRequest = {
        ...req,
        body: {
          files: {
            documents: [
              {
                name: 'some-file',
              },
            ],
          },
        },
        session: {
          uploadedFiles: [{ name: 'original-file' }],
        },
      };

      uploadFiles.mockReturnValue([{ name: 'some-file' }]);

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(mockRequest.session.uploadedFiles).toEqual(
        [{ name: 'original-file' }, { name: 'some-file' }],
        mockRequest
      );
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
        uploadedFiles: [{ name: 'original-file' }, { name: 'some-file' }],
      });
    });

    it('should reload the page showing errors if there is an error uploading the files', async () => {
      const mockRequest = {
        ...req,
        body: {
          files: {
            documents: [
              {
                name: 'some-file',
              },
            ],
          },
        },
      };

      uploadFiles.mockRejectedValue('api-error');

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should reload page showing errors if error summary populated', async () => {
      fileErrorSummary.mockReturnValue([{ error: true }]);
      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
        },
      };

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should reload the page if there is an input error (missing files)', async () => {
      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
          errors: {
            documents: {
              msg: 'some-error',
            },
          },
        },
      };

      fileErrorSummary.mockReturnValue([{ href: 'documents', text: 'some-error' }]);

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(fileErrorSummary).toHaveBeenCalledWith('some-error', undefined);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should reload the page showing errors if there is an error updating the appeal', async () => {
      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
        },
        session: {
          uploadedFiles: [{ name: 'original-file' }],
        },
      };

      updateAppealReply.mockRejectedValue('api-error');

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should redirect with uploaded files set and status passed', async () => {
      getTaskStatus.mockImplementation(() => 'mock-status');

      mockAppealReply.mockSection.mockTask.uploadedFiles = [{ name: 'mock-file' }];
      mockAppealReply.sectionStates.mockSection.mockTask = 'mock-status';

      uploadFiles.mockReturnValue([{ name: 'mock-file' }]);

      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
        },
      };

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(updateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });
  });
});
