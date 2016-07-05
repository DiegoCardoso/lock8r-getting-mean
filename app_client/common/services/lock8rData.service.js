(function(angular) {
  'use strict';

  angular
    .module('lock8rApp')
    .service('lock8rData', lock8rData);

  function lock8rData ($http) {
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

    return {
      locationByCoords: locationByCoords,
    };
  };

}(angular));
