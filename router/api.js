const router = require('express').Router();
const api = require('../controller/Api');

/* GET account page. */

// About Affair
router.post('/createAffair', api.createAffair);
router.post('/createAffairItem/:id', api.createAffairItem);
router.post('/getItemInfo', api.getItemInfo);
router.post('/addRemark', api.addRemark);
router.post('/deleteRemark', api.deleteRemark);
router.post('/deleteItem', api.deleteItem);
router.post('/deleteList', api.deleteList);
router.post('/deleteAffair', api.deleteAffair);
router.post('/renameList', api.renameList);
router.post('/editItem', api.editItem);
// Affair End

module.exports = router;
