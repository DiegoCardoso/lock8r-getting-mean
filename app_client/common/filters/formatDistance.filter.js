(function (angular) {
  'use strict';

  angular
    .module('lock8rApp')
    .filter('formatDistance', formatDistance);

  var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  function formatDistance() {
    return function (distance) {
      if (distance && _isNumeric(distance)) {
        var numDistance, unit;
        if (distance > 1000) {
          numDistance = parseFloat(distance).toFixed(1);
          unit = 'km';
        } else {
          numDistance = parseInt(distance, 10);
          unit = 'm';
        }

        return numDistance + unit;
      }

      return '?';
    };
  }

}(angular));
