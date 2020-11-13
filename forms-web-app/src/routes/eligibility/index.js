const express = require('express');

const router = express.Router();

const appealStatementRouter = require('./appeal-statement');
const decisionDateRouter = require('./decision-date');
const listedBuildingRouter = require('./listed-building');
const planningDepartmentRouter = require('./planning-department');

router.use(appealStatementRouter);
router.use(decisionDateRouter);
router.use(listedBuildingRouter);
router.use(planningDepartmentRouter);

module.exports = router;
