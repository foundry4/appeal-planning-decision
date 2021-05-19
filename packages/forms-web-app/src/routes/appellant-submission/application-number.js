const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const applicationNumberController = require('../../controllers/appellant-submission/application-number');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const {
  rules: applicationNumberValidationRules,
} = require('../../validators/appellant-submission/application-number');

const router = express.Router();

router.get(
  '/application-number',
  [fetchExistingAppealMiddleware],
  applicationNumberController.getApplicationNumber
);
router.post(
  '/application-number',
  applicationNumberValidationRules(),
  validationErrorHandler,
  applicationNumberController.postApplicationNumber
);

module.exports = router;
