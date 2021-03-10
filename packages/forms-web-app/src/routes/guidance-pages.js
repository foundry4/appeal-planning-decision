const express = require('express');
const {
  getBeforeAppeal,
  getWhenAppeal,
  getAfterAppeal,
  getStartAppeal,
} = require('../controllers/guidance-pages');

const router = express.Router();

router.get('/before-you-appeal', getBeforeAppeal);
router.get('/when-you-can-appeal', getWhenAppeal);
router.get('/after-you-appeal', getAfterAppeal);
router.get('/start-your-appeal', getStartAppeal);

module.exports = router;
