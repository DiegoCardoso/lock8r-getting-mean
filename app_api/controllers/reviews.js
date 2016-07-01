const mongoose = require('mongoose');
const Location = mongoose.model('Location');

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
}

const doAddReviewToLocation = (req, res, location) => {
  if (!location) {
    return sendJsonResponse(res, 404, {
      message: 'locationid not found.'
    });
  }

  const { author, rating, reviewText } = req.body;
  const review = {
    author,
    rating,
    reviewText,
  };

  location.reviews.push(review);

  location.save((err, location) => {
    if (err) {
      console.log('ERROR: ', err);
      return sendJsonResponse(res, 400, err);
    }

    updateAverageRating(location._id);
    let reviewJustAdded = location.reviews.slice(-1);
    return sendJsonResponse(res, 201, reviewJustAdded);
  });
};

const updateAverageRating = (locationId) => {
  Location
    .findById(locationId)
    .select('rating reviews')
    .exec((err, location) => {
      if (!err) {
        doSetAverageRating(location);
      }
    });
};

const doSetAverageRating = location => {
  const ratingTotal = location.reviews.reduce((total, review) => total + review.rating, 0);
  const reviewCount = location.reviews.length;
  const ratingAverage = parseInt(ratingTotal / reviewCount, 10);

  location.rating = ratingAverage;

  location.save(err => {
    if (err) {
      return console.log(err);
    }
    console.log(`Average rating updated to ${ratingAverage}`);
  })

};

exports.reviewsCreate = (req, res) => {
  const { locationId } = req.params;

  if (!locationId) {
    return sendJsonResponse(res, 404, {
      message: 'Not found, locationid required.',
    });
  }

  Location
    .findById(locationId)
    .select('reviews')
    .exec((err, location) => {
      if (err) {
        return sendJsonResponse(res, 400, err);
      }

      doAddReviewToLocation(req, res, location);
    })
};

exports.reviewsReadOne = (req, res) => {
  const { locationId, reviewId } = req.params;

  if(!locationId || !reviewId) {
    return sendJsonResponse(res, 400, {
      "message": "Bad request: locationId and reviewId are both required.",
    });
  }

  Location
    .findById(locationId)
    .exec((err, location) => {
      if (err) {
          return sendJsonResponse(res, 404, err);
      }

      if(!location) {
        return sendJsonResponse(res, 404, {
          "message": "locationId not found.",
        });
      }

      if (!location.reviews || location.reviews.length === 0) {
        return sendJsonResponse(res, 404, {
          "message": "No reviews found.",
        });
      }

      const review = location.reviews.id(reviewId);
      console.log("reviewId", location.reviews);
      if (!review) {
        return sendJsonResponse(res, 404, {
          "message": "reviewId not found.",
        });
      }

      const response = {
        location: {
          name: location.name,
          id: locationId,
        },

        review,
      };

      sendJsonResponse(res, 200, response);

    })

};

exports.reviewsUpdateOne = (req, res) => {
  const { locationId, reviewId} = req.params;

  if (!locationId || !reviewId) {
    return sendJsonResponse(res, 404, {
      message: 'Not found, locationId and reviewId are both required.',
    });
  }

  Location
    .findById(locationId)
    .select('reviews')
    .exec((err, location) => {

      if (err) {
        return sendJsonResponse(res, 400, err);
      }

      if (!location) {
        return sendJsonResponse(res, 404, {
          message: 'locationId not found.'
        });
      }

      if (!location.reviews || location.reviews.length === 0) {
        return sendJsonResponse(res, 404, {
          message: 'No review to update.'
        });
      }

      let reviewToUpdate = location.reviews.id(reviewId);

      if (!reviewToUpdate) {
        return sendJsonResponse(res, 404, {
          message: 'reviewId not found.'
        });
      }

      const { author, rating, reviewText } = req.body;

      reviewToUpdate.author = author;
      reviewToUpdate.rating = rating;
      reviewToUpdate.reviewText = reviewText;

      location.save((err, location) => {
        if (err) {
          return sendJsonResponse(res, 400, err);
        }
        updateAverageRating(location._id);
        return sendJsonResponse(res, 200, reviewToUpdate);
      });
    })
};

exports.reviewsDeleteOne = (req, res) => {
  const { locationId, reviewId } = req.params;

  if (!locationId || !reviewId) {
    return sendJsonResponse(res, 404, {
      message: 'Not found, locationId and reviewId are both required.',
    });
  }

  Location
    .findById(locationId)
    .select('reviews')
    .exec((err, location) => {

      if (err) {
        return sendJsonResponse(res, 400, err);
      }

      if (!location) {
        return sendJsonResponse(res, 404, {
          message: 'locationId not found.',
        });
      }

      if (!location.reviews || location.reviews.length === 0) {
        return sendJsonResponse(res, 404, {
          message: 'No review to delete.'
        });
      }

      const reviewToDelete = location.reviews.id(reviewId);

      if (!reviewToDelete) {
        return sendJsonResponse(res, 404, {
          message: 'reviewId not found.'
        });
      }

      reviewToDelete.remove();

      location.save((err) => {
        if (err) {
          return sendJsonResponse(res, 400, err);
        }

        updateAverageRating(location._id);
        sendJsonResponse(res, 204, null);
      });

    });
};
