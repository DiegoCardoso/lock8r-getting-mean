(function(angular) {
  'use strict';

  angular
    .module('lock8rApp')
    .service('lock8rData', lock8rData);

  lock8rData.$inject = ['$http', 'authentication'];

  function lock8rData ($http, authentication) {
    var locationByCoords = function (lat, lng) {
      var uri = [
        '/api/locations?',
        'lng=',
        lng,
        '&lat=',
        lat,
        '&maxdistance=20'
      ].join('');
      return $http.get(uri);
    };

    var locationById = function locationById(locationid) {
      return $http.get('/api/locations/' + locationid);
    };

    var addReviewById = function (locationid, data) {
      var uri = [
        '/api/locations/',
        locationid,
        '/reviews'
      ].join('');

      return $http.post(uri, data, {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      });
    };

    return {
      locationByCoords: locationByCoords,
      locationById: locationById,
      addReviewById: addReviewById,
    };
  };

}(angular));
