/* GET 'home' page */
module.exports.homelist = (req, res) => res.render('locations-list', {
  title: 'Lock8r - find a place to work with wifi',
  pageHeader: {
    title: 'Lock8r',
    strapline: 'Find a place to work with wifi near you!'
  },
  sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
  locations: [
    {
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      distance: '100m',
    },
    {
      name: 'Cafe Hero',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 4,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      distance: '200m',
    },
    {
      name: 'Burger Queen',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 2,
      facilities: ['Food', 'Premium wifi'],
      distance: '250m',
    },
  ],
 });

/* GET 'Location info' page */
module.exports.locationInfo = (req, res) => res.render('location-info', { title: 'Location info' });

/* GET 'Add review' page */
module.exports.addReview = (req, res) => res.render('location-review-form', { title: 'Add review' })
