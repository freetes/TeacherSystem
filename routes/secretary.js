const router = require('express').Router();
const secretary = require('../controllers/Secretary');

router.post('/passRequest', secretary.passRequest);

router.post('/refuseRequest', secretary.refuseRequest);

router.post('/sendMessage', secretary.sendMessage);

router.post('/addNewUser', secretary.addNewUser);

module.exports = router;
