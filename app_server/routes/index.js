var express = require('express');
var router = express.Router();

var mainCtrl = require('../controllers/main')


/* GET home page. */
router.get('/', mainCtrl.index);

module.exports = router;
