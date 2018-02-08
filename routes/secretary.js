const router = require('express').Router();
const secretary = require('../controllers/Secretary');

router.post('/getAllInfo', secretary.getAllInfo);

router.post('/passRequest', secretary.passRequest);

router.post('/refuseRequest', secretary.refuseRequest);

router.post('/sendMessage', secretary.sendMessage);

module.exports = router;
