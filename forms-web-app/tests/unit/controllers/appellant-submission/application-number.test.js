const applicationNumberController = require('../../../../src/controllers/appellant-submission/application-number');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

const sectionName = 'requiredDocumentsSection';
const taskName = 'applicationNumber';

describe('controller/appellant-submission/application-number', () => {
  describe('getApplicationNumber', () => {
    it('should call the correct template', () => {
      applicationNumberController.getApplicationNumber(req, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postApplicationNumber', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await applicationNumberController.postApplicationNumber(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER, {
        appeal: req.session.appeal,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
      });
    });

    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
      const mockRequest = {
        ...req,
        body: {},
      };
      await applicationNumberController.postApplicationNumber(mockRequest, res);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/appellant-submission/upload-application` if valid', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));

      const mockRequest = {
        ...req,
        body: {
          'application-number': 'some valid application number',
        },
      };

      await applicationNumberController.postApplicationNumber(mockRequest, res);

      const { empty: goodAppeal } = APPEAL_DOCUMENT;
      goodAppeal[sectionName][taskName] = 'some valid application number';
      goodAppeal.sectionStates[sectionName][taskName] = 'COMPLETED';

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION}`);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(goodAppeal);
    });
  });
});
