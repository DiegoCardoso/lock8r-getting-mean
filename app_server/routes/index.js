var express = require('express');
var router = express.Router();

var locationsCtrl = require('../controllers/locations');
var othersCtrl = require('../controllers/others');


/* Location pages. */
router.get('/', locationsCtrl.homelist);
router.get('/location', locationsCtrl.locationInfo);
router.get('/location/review/new', locationsCtrl.addReview);

/* Others pages */
router.get('/about', othersCtrl.about);

module.exports = router;
