(function() {
  'use strict';
  function onAddReview_Submit(e) {
    var alertDanger = $('.alert.alert-danger'),
        name = addReview.name.value,
        rating = addReview.rating.value,
        review = addReview.review.value;

    alertDanger.hide();

    if (!name || !rating || !review) {
      e.preventDefault();

      if (alertDanger.length) {
        alertDanger.show();
      } else {
        $(addReview).prepend('<div role="alert" class="alert alert-danger">All fields are required. Please, try again.</div>');
      }
    }
  }

  var addReview = document.forms.addReview;

  if (addReview) {
    addReview.addEventListener('submit', onAddReview_Submit);
  }


}());
