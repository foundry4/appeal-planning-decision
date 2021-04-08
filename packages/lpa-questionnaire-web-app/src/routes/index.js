const express = require('express');

const router = express.Router();

const homeRouter = require('./home');
const taskListRouter = require('./task-list');
const accuracySubmissionRouter = require('./accuracy-submission');
const otherAppealsRouter = require('./other-appeals');
const extraConditionsRouter = require('./extra-conditions');
const developmentPlanRouter = require('./development-plan');
const questionnaireSubmittedRouter = require('./questionnaire-submitted');

router.use(homeRouter);
router.use(taskListRouter);
router.use(accuracySubmissionRouter);
router.use(otherAppealsRouter);
router.use(extraConditionsRouter);
router.use(developmentPlanRouter);
router.use(questionnaireSubmittedRouter);

module.exports = router;
