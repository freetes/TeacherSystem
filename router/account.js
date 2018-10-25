const router = require('express').Router();
const account = require('../controller/Account');

/* GET account page. */
router.get('/', account.index);
router.post('/', account.signinPost);

module.exports = router;
