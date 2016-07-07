(function(angular) {
  'use strict';

  angular
    .module('lock8rApp')
    .controller('locationDetailCtrl', locationDetailCtrl);


  locationDetailCtrl.$inject = ['$routeParams', '$location', '$uibModal', 'lock8rData', 'authentication'];
  function locationDetailCtrl($routeParams, $location, $uibModal, lock8rData, authentication) {
    var vm = this;

    vm.locationid = $routeParams.locationid;

    vm.isLoggedIn = authentication.isLoggedIn();

    vm.currentPath = $location.path();

    lock8rData.locationById(vm.locationid)
      .success(function (data) {
        vm.data = { location: data };
        vm.pageHeader = {
          title: vm.data.location.name,
        };
      })
      .error(function (e) {
        console.log(e);
      });

    vm.popupReviewForm = function () {
      var modalInstance = $uibModal.open({
        templateUrl: '/reviewModal/reviewModal.view.html',
        controller: 'reviewModalCtrl',
        controllerAs: 'vm',
        resolve: {
          locationData: function () {
              return {
                locationid: vm.locationid,
                locationName: vm.data.location.name,
              };
          },
        },
      });

      modalInstance.result.then(function (data) {
        vm.data.location.reviews = vm.data.location.reviews.concat(data);
      })
    };
  }

}(angular));
