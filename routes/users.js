const router = require('express').Router();
const user = require('../controllers/User');

/* GET users listing. */

router.post('/newPay', user.newPay);

router.post('/changePay', user.changePay);

router.post('/checkPay', user.checkPay);

module.exports = router;
