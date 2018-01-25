const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');

// 处理主页的请求
const Home = {
  // GET /
  index: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.redirect(303, '/signin');
    Models.UserModel.find({'id': req.session.userid}, (err, user)=>{
      CtrlDB.getAllInfoByUserId(req.session.userid).then(info=>{
        return res.render('index',{
          title: '主页',
          user: user[0],
          classes: info
        });
      });
    })
  },

  // GET /signin
  signinGet: (req, res)=>{
    req.session.userid = null;

    res.render('signin', {
      title: '教师工作量管理系统'
    });
  },

  // POST /signin
  signinPost: (req, res)=>{
    Models.UserModel.find({'id': req.body.id}, (err, user)=>{
      if(user.length != 0){
        if(user[0].password == req.body.password){
          req.session.userid = user[0].id;
          return res.redirect(303, '/');
        }
        else{
          return res.render('signin',{
            title: '教师工作量管理系统',
            message: '密码错误，请重新输入！'
          });
        }
      }
      else{
        return res.render('signin',{
          title: '教师工作量管理系统',
          message: '账号不存在，请重新输入！'
        });
      }
    });
  },

};

module.exports = Home;
