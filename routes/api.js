const router = require('express').Router();
const api = require('../controllers/Api');

router.post('/changePasswd', api.changePasswd);

router.post('/confirmPasswd', api.confirmPasswd);

router.post('/secretary/getAllInfo', api.Secretary.getAllInfo);

module.exports = router;
