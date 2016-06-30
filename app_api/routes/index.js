const express = require('express');
const router = express.Router();

const locationsCtrl = require('../controllers/locations');
const reviewsCtrl = require('../controllers/reviews');

/* Locations */
router.get('/locations', locationsCtrl.locationsListByDistance);
router.post('/locations', locationsCtrl.locationsCreate);
router.get('/locations/:locationId', locationsCtrl.locationsReadOne);
router.put('/locations/:locationId', locationsCtrl.locationsUpdateOne);
router.delete('/locations/:locationId', locationsCtrl.locationsDeleteOne);

/* Reviews */
router.post('/locations/:locationId/reviews', reviewsCtrl.reviewsCreate);
router.get('/locations/:locationId/reviews/:reviewId', reviewsCtrl.reviewsReadOne);
router.put('/locations/:locationId/reviews/:reviewId', reviewsCtrl.reviewsUpdateOne);
router.delete('/locations/:locationId/reviews/:reviewId', reviewsCtrl.reviewsDeleteOne);

module.exports = router;
