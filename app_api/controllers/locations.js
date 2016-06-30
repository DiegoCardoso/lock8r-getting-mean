const mongoose = require('mongoose');
const Location = mongoose.model('Location');

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

const theEarth = (() => {
  const earthRadius = 6371;

  const getDistanceFromRads = (rads) => parseFloat(rads * earthRadius);

  const getRadsFromDistance = (distance) => parseFloat(distance / earthRadius);

  return {
    getDistanceFromRads,
    getRadsFromDistance,
  }
})();

const getLocationFromRequestBody = req => {
  let {
    name,
    address,
    lng,
    lat,
  } = req.body;

  const facilities = req.body.facilities
                        .split(',')
                        .map((facility) => facility.trim());

  lng = parseFloat(lng);
  lat = parseFloat(lat);
  const coords = [lng, lat];
  const openingTimes = [
    {
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1 === 'true',
    },
    {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2 === 'true',
    }
  ];

  return {
    name,
    address,
    facilities,
    coords,
    openingTimes
  };
}

exports.locationsListByDistance = (req, res) => {
  let { lng, lat, maxdistance } = req.query;

  lng = parseFloat(lng);
  lat = parseFloat(lat);
  maxdistance = parseInt(maxdistance);

  const point = {
    type: 'Point',
    coordinates: [lng, lat],
  };

  const geoOptions = {
    spherical: true,
    maxDistance: maxdistance, //theEarth.getRadsFromDistance(maxdistance),
    num: 10,
  };

  Location.geoNear(point, geoOptions, (err, results, stats) => {
    if (!!err) {
      return sendJsonResponse(res, 400, err);
    }

    console.log('STATS', stats);
    console.log('RESULTS', results);
    console.log('QUERY', { lng, lat, maxdistance });

    if (!results || results.length === 0) {
      return sendJsonResponse(res, 404, {
        "message": "No place found.",
      })
    }

    const locations = results.map((doc) => ({
        distance: doc.dis,//theEarth.getDistanceFromRads(doc.dis),
        name: doc.obj.name,
        address: doc.obj.address,
        rating: doc.obj.rating,
        facilities: doc.obj.facilities,
        _id: doc.obj._id,
    }));

    return sendJsonResponse(res, 200, locations);
  });
};

exports.locationsCreate = (req, res) => {

  const location = getLocationFromRequestBody(req);

  Location.create(location, (err, location) => {
    if (err) {
      return sendJsonResponse(res, 400, err);
    }

    sendJsonResponse(res, 201, location);
  });
};

exports.locationsReadOne = (req, res) => {
  const { locationId } = req.params;

  if (!locationId) {
    return sendJsonResponse(res, 404, {
      "message": "No locationid in request",
    });
  }

  Location
    .findById(locationId)
    .exec((err, location) => {

      if (err) {
        return sendJsonResponse(res, 400, err);
      }

      if (!location) {
        return sendJsonResponse(res, 404, {
          "message": "locationid not found",
        });
      }

      sendJsonResponse(res, 200, location);
    });
};

exports.locationsUpdateOne = (req, res) => {
  const { locationId } = req.params;

  if (!locationId) {
    return sendJsonResponse(res, 404, {
      message: 'Not found, locationId is required',
    });
  }

  Location
    .findById(locationId)
    .select('-reviews -rating')
    .exec((err, location) => {
      if (err) {
        return sendJsonResponse(res, 400, err);
      }

      if (!location) {
        return sendJsonResponse(res, 404, {
          message: 'locationid not found.'
        });
      }
      const locationToSave = getLocationFromRequestBody(req);
      location.name = locationToSave.name;
      location.address = locationToSave.address;
      location.facilities = locationToSave.facilities;
      location.coords = locationToSave.coords;
      location.openingTimes = locationToSave.openingTimes;

      location.save((err, locationSaved) => {
        if (err) {
          return sendJsonResponse(res, 404, err);
        }

        return sendJsonResponse(res, 200, locationSaved);
      })
    });
};

exports.locationsDeleteOne = (req, res) => {
  const { locationId } = req.params;

  if (!locationId) {
    return sendJsonResponse(res, 404, {
      message: 'locationId is required.'
    });
  }

  Location
    .findByIdAndRemove(locationId)
    .exec((err, location) => {
      if (err) {
        return sendJsonResponse(res, 400, err);
      }

      sendJsonResponse(res, 204, null);
    });
};
