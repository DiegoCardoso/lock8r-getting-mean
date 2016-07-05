(function() {
  'use strict';
  angular
    .module('lock8rApp')
    .controller('homeCtrl', homeCtrl);

    function homeCtrl($scope, lock8rData, geolocation) {
      var vm = this;
      vm.pageHeader = {
        title: 'Lock8r',
        strapline: 'Find places to work with wifi near you!',
      };

      vm.sidebar = {
        content: 'Looking for wifi and a seat etc etc',
      };

      vm.message = 'Checking your location...';

      vm.getData = function (position) {
        var lat = position.coords.latitude,
            lng = position.coords.longitude;

        vm.message = 'Searching for nearby places...';
        vm.data = { locations: [] };

        console.log('POSITION:', position);

        lock8rData.locationByCoords(lat, lng)
          .success(function (data) {
            vm.message = data.length > 0 ? '' : 'No locations found nearby.. =(';
            vm.data =  { locations: data };
          })
          .error(function (e) {
            console.error(e);
            vm.message = e.message;
          });
      };

      vm.showError = function (error) {
        $scope.$apply(function () {
          vm.message = error.message;
        });
      };

      vm.noGeo = function () {
        $scope.$apply(function () {
          vm.message = 'Geolocation is not supported by this browser.';
        });
      };

      geolocation.getPosition(vm.getData, vm.showError, vm.noGeo);
    }
}());
