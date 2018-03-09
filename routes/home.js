const router = require('express').Router();
const home = require('../controllers/Home');

/* GET home page. */
router.get('/', home.index);

router.get('/exportdoc', home.exportDoc);

router.get('/signin', home.signinGet);

router.post('/signin', home.signinPost);

module.exports = router;
