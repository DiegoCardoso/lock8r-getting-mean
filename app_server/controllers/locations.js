const request = require('request');

let apiOptions = {
  server: 'http://localhost:3000/',
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://fierce-reaches-12852.herokuapp.com/';
}

/**
  @param baseURL String containing the baseURL of the request.
*/
const makeRequestOptions = (baseURL, uri, method, json, qs) => ({
    uri: `${baseURL}${uri}`,
    method,
    json,
    qs
});

const _formatDistance = distance => {
  let numDistance, unit;
  if (distance > 1000) {
    numDistance = parseFloat(distance).toFixed(1);
    unit = 'km';
  } else {
    numDistance = parseInt(distance, 10);
    unit = 'm';
  }

  return `${numDistance}${unit}`;
};

const _showError = (req, res, status) => {
  let title, content;

  if (status === 404) {
    title = '404, page not found',
    content = 'Oh, dear! Looks like we can\'t find this page. Sorry. =(';
  } else {
    title = `${status}, something's gone wrong.`;
    content = `Something, somewhere, has gone just a little bit wrong.`;
  };

  res.status(status);
  res.render('generic-text', {
    title,
    content,
  })
}

const renderHomepage = (req, res, locations) => {
  let message;

  if (!(locations instanceof Array)) {
    message = 'API lookup error';
    locations = [];
  } else if (!locations.length) {
    message = 'No places found nearby';
  }

  res.render('locations-list', {
    title: 'Lock8r - find a place to work with wifi',
    pageHeader: {
      title: 'Lock8r',
      strapline: 'Find a place to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
    locations: [],
    // message,
  });
};

/* GET 'home' page */
module.exports.homelist = (req, res) => {
  const requestOptions = makeRequestOptions(
    apiOptions.server,
    'api/locations',
    'GET',
    {},
    {
      lng: -0.9699313,
      lat: 51.4557617,
      maxdistance: 20,
    }
  );
  console.log(requestOptions);
  request(
    requestOptions,
    (err, response, body) => {
      var locations;

      if(response.statusCode === 200 && body.length) {
        locations = body.map(location => Object.assign(location, {
          distance: _formatDistance(location.distance)
        }));
      }

      renderHomepage(req, res, locations);

    }
  );
};

const renderDetailPage = (req, res, location) => {
  res.render('location-info', {
     title: location.name,
     pageHeader: {
         title: location.name,
     },
     sidebar: {
         context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
         callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
     },
     location,
  });
};

const getLocationInfo = (req, res, callback) => {
  const { locationid } = req.params;

  const requestOptions = makeRequestOptions(
    apiOptions.server,
    `api/locations/${locationid}`,
    'GET',
    {},
    null
  );

  request(
    requestOptions,
    (err, response, body) => {

      if (response.statusCode === 200) {
        const location = Object.assign({}, body);
        const [lng, lat] = body.coords;

        location.coords = {
          lng,
          lat
        };

        return callback(req, res, location);
      }

      _showError(req, res, response.statusCode);
    }
  );
};

 /* GET 'Location info' page */
module.exports.locationInfo = (req, res) => {
  getLocationInfo(req, res, renderDetailPage);
};

const renderReviewForm = (req, res, location) => {

  res.render('location-review-form', {
     title: `Review ${location.name} on Loc8r`,
     pageHeader: {
         title: `Review ${location.name}`
     },
     error: req.query.err,
     url: req.originalUrl,
  })
}

/* GET 'Add review' page */
module.exports.addReview = (req, res) => {
  getLocationInfo(req, res, renderReviewForm);
};

exports.doAddReview = (req, res) => {
  const { locationid } = req.params;
  const { name, rating, review } = req.body;
  const postData = {
    author: name,
    rating,
    reviewText: review,
  };

  const requestOptions = makeRequestOptions(
    apiOptions.server,
    `api/locations/${locationid}/reviews`,
    'POST',
    postData
  );

  if (!postData.author || !postData.rating || !postData.reviewText) {
    return res.redirect(`/location/${locationid}/reviews/new?err=val`);
  }

  request(
    requestOptions,
    (err, response, body) => {
        if (response.statusCode === 201) {
          return res.redirect(`/location/${locationid}`);
        }

        if (response.statusCode === 400 && body.name === 'ValidationError') {
          return res.redirect(`/location/${locationid}/reviews/new?err=val`);
        }

        _showError(req, res, response.statusCode);
    }
  );
};
