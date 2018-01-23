const Models = require('../model/dataModel');

// 处理主页的请求
const Home = {
  // GET /
  index: (req, res)=>{
    if(req.session.username == undefined || req.session.username == null)
      return res.redirect(303, '/signin');
  
    res.render('index', {
      title: `教师工作量管理系统`
    });
  },

  // GET /signin
  signin: (req, res)=>{
    req.session.username = null;

    res.render('signin', {
      title: '教师工作量管理系统'
    });
  },

  // POST /signin
  signin: (req, res)=>{
    req.session.username = null;

    res.render('signin', {
      title: '教师工作量管理系统'
    });
  },

};

module.exports = Home;
