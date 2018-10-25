const router = require('express').Router();
const home = require('../controller/Home');

/* GET home page. */
router.get('/', home.index);

// 事务管理
router.get('/affair', home.affair);
router.get('/affair/:id', home.affairInfo);
router.post('/affair/:id', home.createList);

module.exports = router;
