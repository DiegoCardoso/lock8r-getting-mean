/* GET 'home' page */
module.exports.homelist = (req, res) => res.render('locations-list', { title: 'Home' });

/* GET 'Location info' page */
module.exports.locationInfo = (req, res) => res.render('index', { title: 'Location info' });

/* GET 'Add review' page */
module.exports.addReview = (req, res) => res.render('index', { title: 'Add review' })
