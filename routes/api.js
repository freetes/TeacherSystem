const router = require('express').Router();
const api = require('../controllers/Api');

router.post('/changePasswd', api.changePasswd);

router.post('/confirmPasswd', api.confirmPasswd);

router.post('/getMessage', api.getMessage);

router.post('/secretary/getAllInfo', api.Secretary.getAllInfo);

router.post('/secretary/passRequest', api.Secretary.passRequest);

router.post('/secretary/refuseRequest', api.Secretary.refuseRequest);

module.exports = router;
