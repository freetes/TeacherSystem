const router = require('express').Router();
const api = require('../controllers/Api');

router.post('/changePasswd', api.changePasswd);

router.post('/confirmPasswd', api.confirmPasswd);

router.get('/getMessage', api.getMessage);

router.post('/getName', api.getName);

module.exports = router;
