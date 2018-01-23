const router = require('express').Router();
const home = require('../controllers/Home');

/* GET home page. */
router.get('/', home.index);

router.get('/signin', home.signin);

module.exports = router;
