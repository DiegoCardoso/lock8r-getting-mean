(function(angular) {
  'use strict';
  angular.module('lock8rApp', []);

  var formatDistance = function () {
    return function (distance) {
      var numDistance, unit;
      if (distance > 1) {
        numDistance = parseFloat(distance).toFixed(1);
        unit = 'km';
      } else {
        numDistance = parseInt(distance * 1000, 10);
        unit = 'm';
      }

      return numDistance + unit;
    }
  };

  var locationListCtrl = function locationListCtrl($scope, lock8rData, geoLocation) {

    $scope.message = 'Checking your location...';
    $scope.getData = function (position) {
      console.log('POSITION:',position);
      $scope.message = 'Searching for nearby places...';
      lock8rData.locationByCoords(position.coords.latitude, position.coords.longitude)
        .success(function onSuccess(data) {
          $scope.message = data.length > 0 ? '' : 'No locations find. =(';

          $scope.data = {
            locations: data,
          };
        })
        .error(function onError(e) {
          $scope.message = e.message;
          console.error('ERROR:', e);
        });
    };

    $scope.showError = function (error) {
      $scope.$apply(function () {
        $scope.message = error.message;
      });
    };

    $scope.noGeo = function () {
      $scope.$apply(function () {
        $scope.message = 'Geolocation not supported by this browser.';
      });
    };

    geoLocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
  };

  var ratingStars = function ratingStars() {
    return {
      scope: {
        thisRating: '=rating',
      },
      templateUrl: "/angular/rating-stars.html",
    };
  };

  var lock8rData = function ($http) {
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

  var geoLocation = function () {
    var getPosition = function (cbSuccess, cbError, cbNoGeo) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
      } else {
        cbNoGeo();
      }
    };

    return {
      getPosition: getPosition,
    };
  };

  angular
    .module('lock8rApp')
    .controller('locationListCtrl', locationListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)
    .service('lock8rData', lock8rData)
    .service('geoLocation', geoLocation);


}(angular));
