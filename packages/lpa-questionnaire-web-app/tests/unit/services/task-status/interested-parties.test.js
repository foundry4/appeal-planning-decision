const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const interestedPartiesCompletion = require('../../../../src/services/task-status/interested-parties');

describe('services/task.service/task-status/interested-parties', () => {
  [
    {
      title: 'should return null if no appeal reply passed',
      mockAppealReply: undefined,
      result: null,
    },
    {
      title: 'should return not started if uploadedFiles undefined',
      mockAppealReply: {
        optionalDocumentsSection: {
          representationsInterestedParties: {},
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return not started if uploadedFiles empty',
      mockAppealReply: {
        optionalDocumentsSection: {
          representationsInterestedParties: {
            uploadedFiles: [],
          },
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return completed if uploadedFiles has content',
      mockAppealReply: {
        optionalDocumentsSection: {
          representationsInterestedParties: {
            uploadedFiles: [{ name: 'mock-file' }],
          },
        },
      },
      result: COMPLETED,
    },
  ].forEach(({ title, mockAppealReply, result }) => {
    it(title, () => {
      expect(interestedPartiesCompletion(mockAppealReply)).toEqual(result);
    });
  });
});
