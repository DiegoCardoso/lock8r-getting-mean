var express = require('express');
var router = express.Router();

var locationsCtrl = require('../controllers/locations');
var othersCtrl = require('../controllers/others');


/* Location pages. */
router.get('/', othersCtrl.angularApp);
router.get('/location/:locationid', locationsCtrl.locationInfo);
router.get('/location/:locationid/reviews/new', locationsCtrl.addReview);
router.post('/location/:locationid/reviews/new', locationsCtrl.doAddReview);

/* Others pages */
router.get('/about', othersCtrl.about);

module.exports = router;
