const router = require('express').Router();
const admin = require('../controllers/Admin');

/* GET home page. */
router.post('/addUser', admin.addUser);

module.exports = router;
