const express = require('express');
const router = express.Router();

const jwt = require('express-jwt');

const locationsCtrl = require('../controllers/locations');
const reviewsCtrl = require('../controllers/reviews');
const authCtrl = require('../controllers/auth');

const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
});

/* Locations */
router.get('/locations', locationsCtrl.locationsListByDistance);
router.post('/locations', locationsCtrl.locationsCreate);
router.get('/locations/:locationId', locationsCtrl.locationsReadOne);
router.put('/locations/:locationId', locationsCtrl.locationsUpdateOne);
router.delete('/locations/:locationId', locationsCtrl.locationsDeleteOne);

/* Reviews */
router.post('/locations/:locationId/reviews', auth, reviewsCtrl.reviewsCreate);
router.get('/locations/:locationId/reviews/:reviewId', reviewsCtrl.reviewsReadOne);
router.put('/locations/:locationId/reviews/:reviewId', auth, reviewsCtrl.reviewsUpdateOne);
router.delete('/locations/:locationId/reviews/:reviewId', auth, reviewsCtrl.reviewsDeleteOne);

/* Authentication */
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

module.exports = router;
