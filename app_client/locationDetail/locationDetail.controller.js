(function(angular) {
  'use strict';

  angular
    .module('lock8rApp')
    .controller('locationDetailCtrl', locationDetailCtrl);


  locationDetailCtrl.$inject = ['$routeParams', '$uibModal', 'lock8rData'];
  function locationDetailCtrl($routeParams, $uibModal, lock8rData) {
    var vm = this;

    vm.locationid = $routeParams.locationid;

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
