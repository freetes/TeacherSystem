const router = require('express').Router();
const user = require('../controllers/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/changePasswd', user.changePasswd);

module.exports = router;
