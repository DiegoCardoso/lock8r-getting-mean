(function(angular) {
  'use strict';

  angular
    .module('lock8rApp')
    .controller('reviewModalCtrl', reviewModalCtrl);

  reviewModalCtrl.$inject = ['$uibModalInstance', 'lock8rData', 'locationData'];
  function reviewModalCtrl($uibModalInstance, lock8rData, locationData) {
    var vm = this;

    vm.locationData = locationData;
    vm.formData = {};

    vm.modal = {
      cancel: function () {
        $uibModalInstance.dismiss('cancel');
      },
      close: function (data) {
        $uibModalInstance.close(data);
      },
    };

    vm.onSubmit = function () {
      vm.formError = '';
      console.log(vm);
      if (!vm.formData.rating || !vm.formData.reviewText) {
        vm.formError = 'All fields required, please try again.';
        return false;
      }
      vm.doAddReview(vm.locationData.locationid, vm.formData);
      console.log(vm.formData);
      return false;
    };

    vm.doAddReview = function (locationid, formData) {
      lock8rData.addReviewById(locationid, {
          rating: formData.rating,
          reviewText: formData.reviewText,
        })
        .success(function (data) {
          console.log('Success!');
          vm.modal.close(data);
        })
        .error(function (data) {
          vm.formError = 'Your review has not been saved, try again.';
        });

        return false;
    };
  }

}(angular));
