const whoAreYouController = require('../../../../src/controllers/appellant-submission/who-are-you');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { FORM_FIELD } = require('../../../../src/controllers/appellant-submission/who-are-you');
const logger = require('../../../../src/lib/logger');
const { EMPTY_APPEAL } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const res = mockRes();

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

describe('controller/appellant-submission/who-are-you', () => {
  describe('getWhoAreYou', () => {
    it('should call the correct template', () => {
      const req = mockReq();

      whoAreYouController.getWhoAreYou(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
        FORM_FIELD,
        appeal: req.session.appeal,
      });
    });
  });

  describe('postWhoAreYou', () => {
    it('should redirect with original-appellant set to true', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'are-you-the-original-appellant': 'yes',
          errors: {},
          errorSummary: {},
        },
      };

      await whoAreYouController.postWhoAreYou(mockRequest, res);

      const appeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
      appeal[sectionName][taskName].isOriginalApplicant = true;
      appeal.sectionStates[sectionName][taskName] = 'IN PROGRESS';

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS}`);
    });

    it('should redirect with original-appellant set to false', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'are-you-the-original-appellant': 'no',
          errors: {},
          errorSummary: {},
        },
      };

      await whoAreYouController.postWhoAreYou(mockRequest, res);

      const appeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
      appeal[sectionName][taskName].isOriginalApplicant = false;
      appeal.sectionStates[sectionName][taskName] = 'IN PROGRESS';

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS}`);
    });

    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'are-you-the-original-appellant': true,
          errors: { a: 'b' },
          errorSummary: { a: { msg: 'There were errors here' } },
        },
      };
      await whoAreYouController.postWhoAreYou(mockRequest, res);

      const appeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
      appeal[sectionName][taskName].isOriginalApplicant = false;
      appeal.sectionStates[sectionName][taskName] = 'IN PROGRESS';

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
        FORM_FIELD,
        appeal,
        errorSummary: { a: { msg: 'There were errors here' } },
        errors: { a: 'b' },
      });
    });

    it('should re-render the template with errors if there is any api call error', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {},
      };

      const error = new Error('Cheers');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await whoAreYouController.postWhoAreYou(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
    });
  });
});
